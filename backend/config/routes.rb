Rails.application.routes.draw do
  post "/session", to: "sessions#create"
  delete "/session", to: "sessions#destroy"
  get "/api/auth/session", to: "sessions#check"
  get "/dashboard", to: "dashboard#show"
  
  post "/documents/upload", to: "documents#upload"
  post "/documents/classify", to: "documents#classify"
  get "/documents/export", to: "documents#export"
  post "/documents/:id/review", to: "documents#review"
  get "/documents", to: "documents#index"

  resources :bolsistas, only: [:index, :create, :update, :destroy]
  resources :alertas, only: [:index, :create, :update, :destroy]

  get "/auditoria/state", to: "auditoria#state"
  post "/auditoria/toggle", to: "auditoria#toggle"
end