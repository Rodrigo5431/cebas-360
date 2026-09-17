require 'base64'
require 'json'

class ApplicationController < ActionController::Base
  # Sobrescrevemos a verificação do Rails para evitar bloqueios de CORS/CSRF com o React
  def verify_authenticity_token
    true
  end

  before_action :require_login

  private

  def current_user
    auth_header = request.headers['Authorization']
    token = auth_header.to_s.split(' ').last
    
    uid = nil

    # 1. Se recebemos o Mock JWT do Next.js (composto por 3 partes separadas por ponto)
    if token.present?
      parts = token.split('.')
      
      if parts.length == 3
        begin
          # Desempacota o JWT para pegar o ID verdadeiro do usuário
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
    
    # 2. Fallback para o cookie nativo do Rails
    uid ||= cookies[:duopen_uid]

    if uid.present?
      @current_user ||= User.all.to_a.find { |u| u.id.to_s == uid.to_s }
    end
  end

  def logged_in?
    current_user != nil
  end

  def require_login
    if !logged_in?
      # Retornando JSON puramente sem usar o `render json:`
      self.status = 401
      self.content_type = "application/json"
      self.response_body = { error: "Não autorizado. Faça login." }.to_json
    end
  end
end