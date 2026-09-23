Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  post "/session", to: "sessions#create"
  post "/api/auth/session", to: "sessions#create"
  get "/api/auth/session", to: "sessions#check"
  delete "/api/auth/session", to: "sessions#destroy"

  get "/dashboard", to: "dashboard#show"
  
  post "/documents/upload", to: "documents#upload"
  post "/documents/classify", to: "documents#classify"
  get "/documents/export", to: "documents#export"
  post "/documents/:id/review", to: "documents#review"
  get "/documents", to: "documents#index"
  post "/documents", to: "documents#create"

  get "/institutions", to: "institutions#index"
  resources :bolsistas, only: [:index, :create, :update, :destroy]
  resources :alertas, only: [:index, :create, :update, :destroy]
  resources :categories, only: [:index]

  get "/auditoria/state", to: "auditoria#state"
  post "/auditoria/toggle", to: "auditoria#toggle"
end