class AddOtpToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :otp_secret, :string
  end
end
