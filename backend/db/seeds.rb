puts "==> 🧹 Limpando o banco de dados..."
AuditLog.delete_all
DocumentVersion.delete_all
DocumentItem.delete_all
Category.delete_all
Bolsista.delete_all rescue nil # Rescue caso a tabela ainda tenha dados amarrados
Institution.delete_all
User.delete_all

puts "==> 👥 Criando 12 Usuários..."
users = []
users << User.create!(name: "Dr. Roberto Augusto", email: "advogado@duopen.com.br", password: "password123", password_confirmation: "password123")
users << User.create!(name: "Coordenação Educacional", email: "contato@instituto.org.br", password: "password123", password_confirmation: "password123")

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

puts "==> 🎓 Criando 50 Bolsistas Reais (Para Paginação)..."
nomes = %w[Ana João Maria Pedro Lucas Mariana Carlos Julia Fernanda Marcos Rafael Letícia Gabriel Camila Amanda Thiago Bruno Beatriz Aline Diego]
sobrenomes = %w[Silva Souza Costa Santos Oliveira Pereira Rodrigues Almeida Nunes Carvalho Ferreira Martins Rocha Alves Ribeiro Pinto]
cursos = ["Administração", "Direito", "Pedagogia", "Engenharia Civil", "Enfermagem", "Sistemas de Informação", "Psicologia", "Ensino Médio", "Ensino Fundamental"]
status_bolsa = %w[aprovado pendente em_revisao correcao_solicitada]
tipos_bolsa = ["Integral", "Parcial 50%", "Parcial 25%"]

50.times do |i|
  Bolsista.create!(
    name: "#{nomes.sample} #{sobrenomes.sample} #{sobrenomes.sample}",
    cpf: format('%03d.%03d.%03d-%02d', rand(111..999), rand(111..999), rand(111..999), rand(10..99)),
    course: cursos.sample,
    scholarship_type: tipos_bolsa.sample,
    income: (rand(600..4500) + rand.round(2)),
    signed_term: [true, true, false].sample, # Mais chances de ser true
    status: status_bolsa.sample
  )
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

  # Adicionando Versões de forma segura contra variações na estrutura da tabela
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

puts "==> 🌪️ Criando 36 Documentos de Fechamento Mensal..."
meses = %w[Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro]

meses.each_with_index do |mes, idx|
  vencimento_base = Date.current + (idx - 6).months

  # Contábil
  instituicao.document_items.create!(
    category: cat_contabil, name: "Extrato Bancário Consolidado - #{mes}/2025",
    orientation: "Demonstrativo completo.", mandatory: true, due_date: vencimento_base + 10.days, status: :aprovado, position: idx + 1
  )

  # Trabalhista
  instituicao.document_items.create!(
    category: cat_trabalhista, name: "Folha de Pagamento - #{mes}/2025",
    orientation: "Relatório de salários.", mandatory: true, due_date: vencimento_base + 15.days, status: idx > 8 ? :pendente : :aprovado, position: idx + 1
  )

  # Fiscal (Com histórico massivo de auditoria)
  doc_fiscal = instituicao.document_items.create!(
    category: cat_tributario, name: "Comprovantes INSS/FGTS - #{mes}/2025",
    orientation: "Guias quitadas.", mandatory: true, due_date: vencimento_base + 20.days, status: idx == 8 ? :correcao_solicitada : (idx > 8 ? :pendente : :aprovado), position: idx + 1
  )

  if idx == 8
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

puts "==> ✅ SEED FINALIZADO!"