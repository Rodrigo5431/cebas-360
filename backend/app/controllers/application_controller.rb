require 'base64'
require 'json'

class ApplicationController < ActionController::Base
  def verify_authenticity_token
    true
  end

  before_action :require_login

  private

  def current_user
    auth_header = request.headers['Authorization']
    token = auth_header.to_s.split(' ').last
    
    uid = nil

    if token.present?
      parts = token.split('.')
      if parts.length == 3
        begin
          payload_json = Base64.decode64(parts[1])
          payload = JSON.parse(payload_json)
          uid = payload["id"] || payload["sub"]
        rescue
          uid = nil
        end
      else
        uid = token
      end
    end
    
    uid ||= cookies[:duopen_uid]

    if uid.present?
      @current_user ||= Rails.cache.fetch("user_auth_#{uid}", expires_in: 1.hour) do
        User.find_by(id: uid)
      end
    end
  end

  def logged_in?
    current_user.present?
  end

  def require_login
    unless logged_in?
      self.status = 401
      self.content_type = "application/json"
      self.response_body = { error: "Não autorizado. Faça login." }.to_json
    end
  end
end