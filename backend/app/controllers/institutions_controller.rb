class InstitutionsController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false
  
  def index
    institutions = Institution.order(name: :asc).select(:id, :name)
    render json: { data: institutions }, status: :ok
  end
end