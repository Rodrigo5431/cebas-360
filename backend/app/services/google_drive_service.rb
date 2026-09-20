require 'google/apis/drive_v3'
require 'googleauth'

class GoogleDriveService
  APPLICATION_NAME = 'Plataforma Documental CEBAS'.freeze
  FOLDER_ID = ENV.fetch('GOOGLE_DRIVE_FOLDER_ID', '')

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

  def upload_file(uploaded_file, custom_name = nil)
    return nil unless @drive_service.authorization

    file_metadata = {
      name: custom_name || uploaded_file.original_filename,
      parents: [FOLDER_ID]
    }

    uploaded = @drive_service.create_file(
      file_metadata,
      fields: 'id, web_view_link, web_content_link',
      upload_source: uploaded_file.tempfile.path,
      content_type: uploaded_file.content_type
    )

    {
      drive_id: uploaded.id,
      web_link: uploaded.web_view_link
    }
  rescue StandardError => e
    Rails.logger.error "[GoogleDrive] Erro no upload OAuth: #{e.message}"
    nil
  end
end