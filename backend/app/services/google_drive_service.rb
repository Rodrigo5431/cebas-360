class GoogleDriveService
  def initialize
    @session = GoogleDrive::Session.from_service_account_key(Rails.root.join('config', 'google_drive_config.json'))
    @base_folder_id = ENV['GOOGLE_DRIVE_BASE_FOLDER_ID'] 
  end

  def upload_file(file_path, original_filename, institution_folder_id = nil)
    folder = institution_folder_id ? @session.collection_by_id(institution_folder_id) : @session.collection_by_id(@base_folder_id)
    
    drive_file = folder.upload_from_file(file_path, original_filename, convert: false)
    
    return drive_file.id
  rescue StandardError => e
    Rails.logger.error("Erro na API do Drive: #{e.message}")
    return nil 
  end
end