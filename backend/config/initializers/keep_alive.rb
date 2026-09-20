require 'net/http'
require 'uri'

if Rails.env.production?
  Thread.new do
    sleep 60

    app_url = ENV['RENDER_EXTERNAL_URL'] || ENV['APP_URL']

    if app_url.present?
      ping_uri = URI("#{app_url}/up")

      loop do
        begin
          sleep 12.minutes

          response = Net::HTTP.get_response(ping_uri)
          Rails.logger.info "[KeepAlive] Self-ping disparado para #{ping_uri} - Status: #{response.code}"
        rescue => e
          Rails.logger.warn "[KeepAlive] Erro ao disparar self-ping: #{e.message}"
        end
      end
    else
      Rails.logger.warn "[KeepAlive] Nenhuma URL pública encontrada em RENDER_EXTERNAL_URL. O self-ping não foi ativado."
    end
  end
end