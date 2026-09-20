class DocumentMailer < ApplicationMailer
  default from: 'nao-responda@cebas360.com.br'

  def correction_requested(document_item, reviewer_name, notes)
    @document = document_item
    @reviewer_name = reviewer_name
    @notes = notes
    @recipient = 'contato@instituicaoparceira.com.br'

    mail(to: @recipient, subject: "[CEBAS 360] Ação Necessária: Correção exigida no documento #{@document.name}")
  end
end