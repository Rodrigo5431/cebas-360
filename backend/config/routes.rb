Rails.application.routes.draw do
  # Autenticação e Dashboard
  post "/session", to: "sessions#create"
  delete "/session", to: "sessions#destroy"
  get "/dashboard", to: "dashboard#show"
  
  # Documentos e Conferência
  get "/documents", to: "documents#index"
  post "/documents/:id/upload", to: "documents#upload"
  post "/documents/:id/review", to: "documents#review"
  get "/documents/export", to: "documents#export"
  post "/documents/classify", to: "documents#classify"

  # === NOVAS ROTAS PARA AS TELAS RESTANTES ===
  
  # Bolsistas (Com Paginação)
  get "/bolsistas", to: "bolsistas#index"
  post "/bolsistas", to: "bolsistas#create"

  # Auditoria (Checkboxes Dinâmicos)
  get "/auditoria", to: "auditoria#index"
  post "/auditoria/:id/toggle", to: "auditoria#toggle"

  # Prazos e Alertas (Plano de Ação)
  get "/alertas", to: "alertas#index"
  post "/alertas", to: "alertas#create"

  # Autenticação e Dashboard
  post "/session", to: "sessions#create"
  delete "/session", to: "sessions#destroy"
  
  # Nova rota para o frontend Next.js validar o token e evitar o erro 401
  get "/api/auth/session", to: "sessions#check"
  
end