# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_17_153203) do
  create_schema "extensions"

  # These are extensions that must be enabled in order to support this database
  enable_extension "extensions.pg_stat_statements"
  enable_extension "extensions.pgcrypto"
  enable_extension "extensions.uuid-ossp"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "vault.supabase_vault"

  create_table "public.active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "public.active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "public.active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "public.audit_logs", force: :cascade do |t|
    t.integer "action", null: false
    t.text "comment"
    t.datetime "created_at", null: false
    t.bigint "document_item_id", null: false
    t.bigint "document_version_id"
    t.integer "from_status"
    t.integer "to_status"
    t.bigint "user_id", null: false
    t.index ["document_item_id", "created_at"], name: "index_audit_logs_on_document_item_id_and_created_at"
    t.index ["document_item_id"], name: "index_audit_logs_on_document_item_id"
    t.index ["document_version_id"], name: "index_audit_logs_on_document_version_id"
    t.index ["user_id"], name: "index_audit_logs_on_user_id"
  end

  create_table "public.bolsistas", force: :cascade do |t|
    t.string "course"
    t.string "cpf"
    t.datetime "created_at", null: false
    t.decimal "income"
    t.string "name"
    t.string "scholarship_type"
    t.boolean "signed_term"
    t.string "status"
    t.datetime "updated_at", null: false
  end

  create_table "public.categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "position", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "public.document_items", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.date "due_date"
    t.bigint "institution_id", null: false
    t.boolean "mandatory", default: true, null: false
    t.string "name", null: false
    t.text "orientation"
    t.integer "position", default: 0, null: false
    t.integer "status", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_document_items_on_category_id"
    t.index ["institution_id", "category_id"], name: "index_document_items_on_institution_id_and_category_id"
    t.index ["institution_id", "status"], name: "index_document_items_on_institution_id_and_status"
    t.index ["institution_id"], name: "index_document_items_on_institution_id"
  end

  create_table "public.document_versions", force: :cascade do |t|
    t.text "correction_reason"
    t.datetime "created_at", null: false
    t.bigint "document_item_id", null: false
    t.datetime "reviewed_at"
    t.bigint "reviewed_by_id"
    t.integer "status", default: 0, null: false
    t.datetime "updated_at", null: false
    t.bigint "uploaded_by_id", null: false
    t.integer "version_number", null: false
    t.index ["document_item_id", "version_number"], name: "index_document_versions_on_document_item_id_and_version_number", unique: true
    t.index ["document_item_id"], name: "index_document_versions_on_document_item_id"
    t.index ["reviewed_by_id"], name: "index_document_versions_on_reviewed_by_id"
    t.index ["uploaded_by_id"], name: "index_document_versions_on_uploaded_by_id"
  end

  create_table "public.institutions", force: :cascade do |t|
    t.string "cnpj"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "public.users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "public.active_storage_attachments", "public.active_storage_blobs", column: "blob_id"
  add_foreign_key "public.active_storage_variant_records", "public.active_storage_blobs", column: "blob_id"
  add_foreign_key "public.audit_logs", "public.document_items"
  add_foreign_key "public.audit_logs", "public.document_versions"
  add_foreign_key "public.audit_logs", "public.users"
  add_foreign_key "public.document_items", "public.categories"
  add_foreign_key "public.document_items", "public.institutions"
  add_foreign_key "public.document_versions", "public.document_items"
  add_foreign_key "public.document_versions", "public.users", column: "reviewed_by_id"
  add_foreign_key "public.document_versions", "public.users", column: "uploaded_by_id"

end
