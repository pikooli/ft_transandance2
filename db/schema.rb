# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_28_195553) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "admins", force: :cascade do |t|
    t.string "speudo"
    t.bigint "roomchat_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["roomchat_id"], name: "index_admins_on_roomchat_id"
  end

  create_table "banlists", force: :cascade do |t|
    t.string "speudo"
    t.bigint "roomchat_id"
    t.integer "timeban"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["roomchat_id"], name: "index_banlists_on_roomchat_id"
  end

  create_table "deathmatches", force: :cascade do |t|
    t.string "state"
    t.datetime "begin"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "friendships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "friend_user_id"
    t.index ["friend_user_id", "user_id"], name: "index_friendships_on_friend_user_id_and_user_id", unique: true
    t.index ["user_id", "friend_user_id"], name: "index_friendships_on_user_id_and_friend_user_id", unique: true
  end

  create_table "guilds", force: :cascade do |t|
    t.string "guildname"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "points", default: 0
    t.string "anagram"
    t.bigint "user_id"
    t.string "owner"
    t.index ["anagram"], name: "index_guilds_on_anagram", unique: true
    t.index ["guildname"], name: "index_guilds_on_guildname", unique: true
    t.index ["user_id"], name: "index_guilds_on_user_id"
  end

  create_table "guildwars", force: :cascade do |t|
    t.bigint "guild_1_id"
    t.bigint "guild_2_id"
    t.string "guildname_1"
    t.string "guildanagram_1"
    t.string "guildname_2"
    t.string "guildanagram_2"
    t.integer "pointbet", default: 0
    t.boolean "addon", default: false
    t.integer "setunwanswered", default: 0
    t.boolean "guild_1_accept", default: true
    t.boolean "guild_2_accept", default: false
    t.boolean "finish", default: false
    t.integer "point_1", default: 0
    t.integer "point_2", default: 0
    t.boolean "wartime", default: true
    t.integer "unanswered", default: 0
    t.datetime "start"
    t.datetime "end"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["guild_1_id"], name: "index_guildwars_on_guild_1_id"
    t.index ["guild_2_id"], name: "index_guildwars_on_guild_2_id"
  end

  create_table "matches", force: :cascade do |t|
    t.string "playerLeft"
    t.string "playerRight"
    t.integer "scoreLeft"
    t.integer "scoreRight"
    t.string "matchType"
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_matches_on_user_id"
  end

  create_table "mutes", force: :cascade do |t|
    t.string "speudo"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_mutes_on_user_id"
  end

  create_table "roomchats", force: :cascade do |t|
    t.string "roomname"
    t.string "owner"
    t.string "password"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "userid"
    t.string "username"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "guild_id"
    t.string "status"
    t.string "otp_secret"
    t.boolean "TFA?"
    t.bigint "roomchat_id"
    t.integer "victories", default: 0
    t.integer "losses", default: 0
    t.integer "rank", default: 0
    t.string "G_anagram"
    t.string "match", default: "none"
    t.bigint "deathmatch_id"
    t.boolean "officer", default: false
    t.integer "deathmatch", default: 0
    t.boolean "admin", default: false
    t.bigint "pong"
    t.boolean "banned", default: false
    t.index ["deathmatch_id"], name: "index_users_on_deathmatch_id"
    t.index ["guild_id"], name: "index_users_on_guild_id"
    t.index ["roomchat_id"], name: "index_users_on_roomchat_id"
    t.index ["userid"], name: "index_users_on_userid", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "warmatches", force: :cascade do |t|
    t.bigint "guildwar_id"
    t.string "challenger"
    t.integer "guild_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["guildwar_id"], name: "index_warmatches_on_guildwar_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "guilds", "users"
  add_foreign_key "guildwars", "guilds", column: "guild_1_id"
  add_foreign_key "guildwars", "guilds", column: "guild_2_id"
  add_foreign_key "matches", "users"
  add_foreign_key "users", "deathmatches"
  add_foreign_key "users", "guilds"
  add_foreign_key "warmatches", "guildwars"
end
