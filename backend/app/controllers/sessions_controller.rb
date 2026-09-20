require 'base64'
require 'json'

class SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create]
  skip_before_action :verify_authenticity_token

  def create
    raw_body = request.raw_post.to_s
    body = raw_body.empty? ? {} : JSON.parse(raw_body)
    
    user = User.find_by(email: body["email"])

    if user && user.authenticate(body["password"])
      cookies[:duopen_uid] = user.id.to_s
      
      jwt_payload = {
        id: user.id.to_s,
        name: user.name,
        email: user.email,
        exp: (Time.now + 8.hours).to_i
      }
      
      encoded_payload = Base64.strict_encode64(jwt_payload.to_json)
      mock_jwt = "fake_header.#{encoded_payload}.fake_signature"

      render json: { 
        message: "Autenticado com sucesso", 
        token: mock_jwt, 
        user: { id: user.id, name: user.name, email: user.email } 
      }, status: :ok
    else
      render json: { error: "E-mail ou senha inválidos" }, status: :unauthorized
    end
  end

  def check
    render json: { user: { id: current_user.id, name: current_user.name } }, status: :ok
  end

  def destroy
    cookies.delete(:duopen_uid)
    render json: { message: "Sessão encerrada com sucesso" }, status: :ok
  end
end
