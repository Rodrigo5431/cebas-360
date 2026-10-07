class AddOriginalFilenameToDocumentVersions < ActiveRecord::Migration[8.1]
  def change
    add_column :document_versions, :original_filename, :string
  end
end
