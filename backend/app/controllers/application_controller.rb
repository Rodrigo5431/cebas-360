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
      @current_user ||= User.find_by(id: uid)
    end
  end

  def logged_in?
    current_user.present?
  end

  def require_login
    unless logged_in?
      render json: { error: "Não autorizado. Faça login." }, status: :unauthorized
    end
  end
end
