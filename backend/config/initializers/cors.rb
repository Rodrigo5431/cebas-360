Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://cebas-360.vercel.app', 'https://cebas-360-git-main-rodrigo5431s-projects.vercel.app', 'https://cebas-360-krevv3jjd-rodrigo5431s-projects.vercel.app'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
