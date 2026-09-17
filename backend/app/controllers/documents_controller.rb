class DocumentsController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    # Retornamos DIRETAMENTE os dados simulados para a interface não quebrar.
    # Sem buscas ao banco que podem gerar exceções fatais na ausência das tabelas.
    payload = [
      {
        id: 1,
        category_name: "Institucional",
        name: "Estatuto Social Atualizado",
        orientation: "Enviar cópia autenticada e registrada em cartório.",
        mandatory: true,
        due_date: (Date.today + 10).to_s,
        status: "pendente",
        versions: []
      },
      {
        id: 2,
        category_name: "Contábil",
        name: "Balanço Patrimonial 2025",
        orientation: "Assinado pelo contador responsável.",
        mandatory: true,
        due_date: (Date.today + 5).to_s,
        status: "em_revisao",
        versions: [{ version_number: 1, status: "em_revisao", reason: nil }]
      },
      {
        id: 3,
        category_name: "Fiscal",
        name: "Certidão Negativa de Débitos (CND)",
        orientation: "Deve estar dentro da validade.",
        mandatory: true,
        due_date: (Date.today - 2).to_s,
        status: "correcao_solicitada",
        versions: [{ version_number: 1, status: "correcao_solicitada", reason: "O documento enviado está vencido desde o mês passado." }]
      }
    ]

    render json: payload, status: :ok
  end

  def upload
    render json: { message: "Upload simulado com sucesso." }, status: :ok
  end

  def review
    render json: { message: "Revisão simulada com sucesso." }, status: :ok
  end

  def export
    render plain: "CSV_SIMULADO", content_type: "text/csv"
  end

  def classify
    render json: [], status: :ok
  end
end