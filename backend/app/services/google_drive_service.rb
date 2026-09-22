require 'google/apis/drive_v3'
require 'googleauth'

class GoogleDriveService
  APPLICATION_NAME = 'Plataforma Documental CEBAS'.freeze
  ROOT_FOLDER_ID = ENV.fetch('GOOGLE_DRIVE_FOLDER_ID', '')

  def initialize
    @drive_service = Google::Apis::DriveV3::DriveService.new
    @drive_service.client_options.application_name = APPLICATION_NAME

    client_id = ENV['GOOGLE_CLIENT_ID']
    client_secret = ENV['GOOGLE_CLIENT_SECRET']
    refresh_token = ENV['GOOGLE_REFRESH_TOKEN']

    if client_id.present? && client_secret.present? && refresh_token.present?
      authorizer = Google::Auth::UserRefreshCredentials.new(
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refresh_token,
        scope: ['https://www.googleapis.com/auth/drive']
      )
      @drive_service.authorization = authorizer
    else
      Rails.logger.warn '[GoogleDrive] Credenciais OAuth em falta no .env. Operações do Drive ficarão em mock.'
    end
  end

  def upload_file(uploaded_file, custom_name: nil, institution: nil, category: nil)
    return nil unless @drive_service.authorization

    parent_id = resolve_folder_path(institution, category)

    file_metadata = {
      name: custom_name || uploaded_file.original_filename,
      parents: [parent_id]
    }

    uploaded = @drive_service.create_file(
      file_metadata,
      fields: 'id, web_view_link, web_content_link',
      upload_source: uploaded_file.tempfile.path,
      content_type: uploaded_file.content_type
    )

    { drive_id: uploaded.id, web_link: uploaded.web_view_link }
  rescue StandardError => e
    Rails.logger.error "[GoogleDrive] Erro no upload OAuth: #{e.message}"
    nil
  end

  private

  def resolve_folder_path(institution, category)
    parent = ROOT_FOLDER_ID
    if institution.present?
      name = institution.cnpj.present? ? "#{institution.name} - #{institution.cnpj}" : institution.name
      parent = find_or_create_folder(name, parent)
    end
    parent = find_or_create_folder(category.name, parent) if category.present?
    parent
  end

  def find_or_create_folder(name, parent_id)
    safe_name = name.to_s.gsub("'", "\\\\'")
    query = "name = '#{safe_name}' and mimeType = 'application/vnd.google-apps.folder' and '#{parent_id}' in parents and trashed = false"
    existing = @drive_service.list_files(q: query, fields: 'files(id, name)', spaces: 'drive').files&.first
    return existing.id if existing

    folder = @drive_service.create_file(
      { name: name, mime_type: 'application/vnd.google-apps.folder', parents: [parent_id] },
      fields: 'id'
    )
    folder.id
  end
end