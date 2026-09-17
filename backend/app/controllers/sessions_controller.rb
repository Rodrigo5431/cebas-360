require 'base64'
require 'json'

class SessionsController < ApplicationController
  skip_before_action :require_login, only: [:create]
  skip_before_action :verify_authenticity_token

  def create
    raw_body = request.raw_post.to_s
    body = raw_body.empty? ? {} : JSON.parse(raw_body)
    
    user_email = body["email"]
    password = body["password"]

    user = User.all.to_a.find { |u| u.email == user_email }

    if user && user.authenticate(password)
      cookies[:duopen_uid] = user.id.to_s
      
      # 1. Monta o Payload exatamente como o auth.ts do Next.js exige
      jwt_payload = {
        id: user.id.to_s,
        name: user.name,
        email: user.email,
        exp: (Time.now + 8.hours).to_i
      }
      
      # 2. Codifica em Base64 e cria a estrutura clássica de 3 partes do JWT
      encoded_payload = Base64.strict_encode64(jwt_payload.to_json)
      mock_jwt = "fake_header.#{encoded_payload}.fake_signature"

      self.status = 200
      self.content_type = "application/json"
      self.response_body = { 
        message: "Autenticado com sucesso", 
        token: mock_jwt, 
        user: { id: user.id, name: user.name, email: user.email } 
      }.to_json
    else
      self.status = 401
      self.content_type = "application/json"
      self.response_body = { error: "E-mail ou senha inválidos" }.to_json
    end
  end

  def check
    self.status = 200
    self.content_type = "application/json"
    self.response_body = { user: { id: current_user.id, name: current_user.name } }.to_json
  end

  def destroy
    cookies.delete(:duopen_uid)
    self.status = 200
    self.content_type = "application/json"
    self.response_body = { message: "Sessão encerrada com sucesso" }.to_json
  end
end