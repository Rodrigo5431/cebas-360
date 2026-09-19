puts "==> 🧹 Limpando o banco de dados..."
AuditLog.delete_all rescue nil
DocumentVersion.delete_all rescue nil
DocumentItem.delete_all rescue nil
Category.delete_all rescue nil
Bolsista.delete_all rescue nil
Alerta.delete_all rescue nil 
Institution.delete_all rescue nil
User.delete_all rescue nil

puts "==> 👥 Criando 12 Usuários..."
users = []
users << User.create!(name: "Dr. Roberto Augusto", email: "advogado@duopen.com.br", password: "password123", password_confirmation: "password123")
users << User.create!(name: "Coordenação Educacional", email: "contato@instituto.org.br", password: "password123", password_confirmation: "password123")
users << User.create!(name: "Alberto", email: "admin@covac.com", password: "senha123", password_confirmation: "senha123")

10.times do |i|
  users << User.create!(
    name: "Auditor Assistente #{i+1}", 
    email: "auditor#{i+1}@covac.com.br", 
    password: "password123", 
    password_confirmation: "password123"
  )
end

advogado = users.first
cliente = users[1]

puts "==> 🏢 Criando 10 Instituições..."
instituicoes = []
instituicoes << Institution.create!(name: "Instituto Educacional Horizonte", cnpj: "12.345.678/0001-90")

9.times do |i|
  instituicoes << Institution.create!(
    name: "Associação Beneficente #{['São Paulo', 'Educar', 'Esperança', 'Caminho', 'Luz'].sample} #{i+1}", 
    cnpj: format('%02d.%03d.%03d/0001-%02d', rand(10..99), rand(111..999), rand(111..999), rand(10..99))
  )
end

instituicao = instituicoes.first

puts "==> 🗂️ Criando 10 Categorias..."
nomes_categorias = [
  "Mantenedora", "Mantida(s)", "Contábil & Financeiro", "Trabalhista & Previdenciário", 
  "Fiscal & Tributário", "Infraestrutura", "Corpo Docente", "Projetos Sociais", 
  "Bolsistas e Benefícios", "Auditoria Externa"
]

categorias = nomes_categorias.map.with_index do |nome, i|
  Category.create!(name: nome, position: i + 1)
end

cat_mantenedora = categorias[0]
cat_mantidas    = categorias[1]
cat_contabil    = categorias[2]
cat_trabalhista = categorias[3]
cat_tributario  = categorias[4]

puts "==> 🎓 Criando 150 Bolsistas Reais (Para Paginação)..."
nomes = %w[Ana João Maria Pedro Lucas Mariana Carlos Julia Fernanda Marcos Rafael Letícia Gabriel Camila Amanda Thiago Bruno Beatriz Aline Diego Felipe Igor Clara Laura]
sobrenomes = %w[Silva Souza Costa Santos Oliveira Pereira Rodrigues Almeida Nunes Carvalho Ferreira Martins Rocha Alves Ribeiro Pinto Gomes Mendes Vieira]
cursos = ["Administração", "Direito", "Pedagogia", "Engenharia Civil", "Enfermagem", "Sistemas de Informação", "Psicologia", "Ensino Médio", "Ensino Fundamental", "Educação Infantil"]
status_bolsa = %w[aprovado pendente em_revisao correcao_solicitada]
tipos_bolsa = ["Integral", "Parcial 50%", "Parcial 25%"]

150.times do |i|
  Bolsista.create!(
    name: "#{nomes.sample} #{sobrenomes.sample} #{sobrenomes.sample}",
    cpf: format('%03d.%03d.%03d-%02d', rand(111..999), rand(111..999), rand(111..999), rand(10..99)),
    course: cursos.sample,
    scholarship_type: tipos_bolsa.sample,
    income: (rand(600..4500) + rand.round(2)),
    signed_term: [true, true, false].sample, 
    status: status_bolsa.sample
  )
end

puts "==> ⏰ Criando Alertas e Prazos Regulatórios..."
alertas_data = [
  { titulo: "Protocolo de Renovação CEBAS", category: "Institucional", mensagem: "O protocolo deve ser realizado com antecedência mínima de 360 dias do vencimento. Reunir todas as evidências aprovadas.", due_date: 15.days.from_now, tipo: "warning" },
  { titulo: "Atualização de CNDs (FGTS e Receita)", category: "Fiscal", mensagem: "As certidões negativas atuais perdem a validade no fim da semana. Solicitar novas guias junto à contabilidade.", due_date: 3.days.from_now, tipo: "error" },
  { titulo: "Ata de Eleição da Diretoria Registrada", category: "Governança", mensagem: "A ata da última eleição ainda não foi validada em cartório. Providenciar urgentemente para não travar o processo.", due_date: 2.days.ago, tipo: "error" },
  { titulo: "Fechamento da Relação de Bolsistas", category: "Gratuidade", mensagem: "Consolidar a planilha do 2º semestre para importação na plataforma MEC.", due_date: 30.days.from_now, tipo: "warning" },
  { titulo: "Parecer de Auditoria Independente", category: "Contábil", mensagem: "Como a receita bruta ultrapassa o limite legal, é obrigatório anexar o parecer dos auditores independentes.", due_date: 45.days.from_now, tipo: "warning" }
]

alertas_data.each do |alerta|
  Alerta.create!(alerta) rescue nil
end

puts "==> 📄 Criando Documentos Base do CEBAS..."
itens_cebas = [
  { name: "Declaração de cumprimento CEBAS", category: cat_mantenedora, status: :aprovado },
  { name: "Cartão CNPJ (Matriz e Filiais)", category: cat_mantenedora, status: :aprovado },
  { name: "Ata de Eleição da Atual Diretoria", category: cat_mantenedora, status: :correcao_solicitada },
  { name: "Estatuto com cláusula de destinação", category: cat_mantenedora, status: :pendente },
  { name: "Relatório de Execução Anual", category: cat_mantenedora, status: :em_revisao },
  { name: "Ato de Credenciamento", category: cat_mantidas, status: :aprovado },
  { name: "Declaração de Perfil Socioeconômico", category: cat_mantidas, status: :pendente },
  { name: "Relação Nominal de Bolsistas", category: cat_mantidas, status: :em_revisao },
  { name: "Termo de Concessão de Bolsas", category: cat_mantidas, status: :correcao_solicitada },
  { name: "Editais de Seleção", category: cat_mantidas, status: :pendente }
]

itens_cebas.each_with_index do |attrs, idx|
  item = instituicao.document_items.create!(
    category: attrs[:category],
    name: attrs[:name],
    orientation: "Documento obrigatório conforme checklist regulatório do CEBAS.",
    mandatory: true,
    due_date: Date.current + (idx + 2).days,
    status: attrs[:status],
    position: idx + 1
  )

  if item.status.to_s != "pendente"
    versao = begin
      item.document_versions.create!(
        version_number: 1, 
        status: item.status, 
        correction_reason: item.status.to_s == "correcao_solicitada" ? "Arquivo inválido ou sem carimbo." : nil,
        uploaded_by: cliente, 
        reviewed_by: advogado, 
        reviewed_at: 1.day.ago
      )
    rescue
      item.document_versions.create!(
        version_number: 1, 
        status: item.status, 
        correction_reason: item.status.to_s == "correcao_solicitada" ? "Arquivo inválido." : nil
      )
    end

    begin
      item.audit_logs.create!(
        document_version: versao, 
        user: advogado, 
        action: item.status.to_s == "aprovado" ? "approval" : "review", 
        from_status: "pendente", 
        to_status: item.status, 
        comment: "Análise inicial do sistema."
      )
    rescue
      nil
    end
  end
end

puts "==> 🌪️ Criando 72 Documentos de Fechamento Mensal (Histórico de 2 Anos)..."
meses = %w[Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro]
anos = [2025, 2026]

anos.each do |ano|
  meses.each_with_index do |mes, idx|
    vencimento_base = Date.new(ano, idx + 1, 15)

    # Contábil
    instituicao.document_items.create!(
      category: cat_contabil, name: "Extrato Bancário Consolidado - #{mes}/#{ano}",
      orientation: "Demonstrativo completo.", mandatory: true, due_date: vencimento_base + 10.days, status: ano == 2025 ? :aprovado : :pendente, position: idx + 1
    )

    # Trabalhista
    instituicao.document_items.create!(
      category: cat_trabalhista, name: "Folha de Pagamento - #{mes}/#{ano}",
      orientation: "Relatório de salários.", mandatory: true, due_date: vencimento_base + 15.days, status: (ano == 2025 || idx < 6) ? :aprovado : :pendente, position: idx + 1
    )

    # Fiscal 
    doc_fiscal = instituicao.document_items.create!(
      category: cat_tributario, name: "Comprovantes INSS/FGTS - #{mes}/#{ano}",
      orientation: "Guias quitadas.", mandatory: true, due_date: vencimento_base + 20.days, status: (ano == 2026 && idx == 5) ? :correcao_solicitada : ((ano == 2025 || idx < 5) ? :aprovado : :pendente), position: idx + 1
    )

    if ano == 2026 && idx == 5
      (1..4).each do |num|
        status_v = num.even? ? :correcao_solicitada : :em_revisao
        motivo = num.even? ? "Ilegível na versão #{num}." : nil
        
        v = begin
          doc_fiscal.document_versions.create!(version_number: num, status: status_v, correction_reason: motivo, uploaded_by: cliente, reviewed_by: advogado)
        rescue
          doc_fiscal.document_versions.create!(version_number: num, status: status_v, correction_reason: motivo)
        end

        begin
          doc_fiscal.audit_logs.create!(document_version: v, user: advogado, action: "review_cycle", from_status: "pendente", to_status: status_v.to_s, comment: "Ciclo de revisão #{num}.")
        rescue
          nil
        end
      end
    end
  end
end

puts "==> ✅ SEED FINALIZADO COM SUCESSO!"