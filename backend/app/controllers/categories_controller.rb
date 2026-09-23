class CategoriesController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    categories = Category.order(:position).select(:id, :name)
    render json: { data: categories }, status: :ok
  end
end