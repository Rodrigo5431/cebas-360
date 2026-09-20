class AddDriveIdToDocumentVersions < ActiveRecord::Migration[8.1]
  def change
    add_column :document_versions, :drive_id, :string
    add_column :document_versions, :drive_url, :string
  end
end
