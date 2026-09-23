puts "==> 🧹 Limpando o banco de dados..."
DocumentComment.delete_all rescue nil
AuditLog.delete_all rescue nil
DocumentVersion.delete_all rescue nil
DocumentItem.delete_all rescue nil
Category.delete_all rescue nil
Bolsista.delete_all rescue nil
Alerta.delete_all rescue nil
Institution.delete_all rescue nil
User.delete_all rescue nil

puts "==> 👥 Criando 15 Usuários..."
users = []
users << User.create!(name: "Dr. Roberto Augusto", email: "advogado@duopen.com.br", password: "password123", password_confirmation: "password123")
users << User.create!(name: "Coordenação Educacional", email: "contato@instituto.org.br", password: "password123", password_confirmation: "password123")
users << User.create!(name: "Alberto", email: "admin@covac.com", password: "senha123", password_confirmation: "senha123")

12.times do |i|
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
instituicao_secundaria = instituicoes[1]
instituicao_terciaria = instituicoes[2]

puts "==> 🗂️ Criando 10 Categorias..."
nomes_categorias = [
  "Mantenedora", "Mantida(s)", "Contábil & Financeiro", "Trabalhista & Previdenciário",
  "Fiscal & Tributário", "Infraestrutura", "Corpo Docente", "Projetos Sociais",
  "Bolsistas e Benefícios", "Auditoria Externa"
]

categorias = nomes_categorias.map.with_index do |nome, i|
  Category.create!(name: nome, position: i + 1)
end

cat_mantenedora  = categorias[0]
cat_mantidas     = categorias[1]
cat_contabil     = categorias[2]
cat_trabalhista  = categorias[3]
cat_tributario   = categorias[4]
cat_infra        = categorias[5]
cat_docente      = categorias[6]
cat_social       = categorias[7]
cat_bolsistas    = categorias[8]
cat_auditoria    = categorias[9]

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
  { titulo: "Parecer de Auditoria Independente", category: "Contábil", mensagem: "Como a receita bruta ultrapassa o limite legal, é obrigatório anexar o parecer dos auditores independentes.", due_date: 45.days.from_now, tipo: "warning" },
  { titulo: "Renovação do Alvará de Funcionamento", category: "Infraestrutura", mensagem: "O alvará municipal vence este mês, protocolo de renovação deve ser feito com antecedência.", due_date: 10.days.from_now, tipo: "warning" },
  { titulo: "Regularização da RAIS", category: "Trabalhista", mensagem: "Prazo final para envio da RAIS ao Ministério do Trabalho.", due_date: 7.days.from_now, tipo: "error" },
  { titulo: "Atualização do Regimento Interno", category: "Institucional", mensagem: "O regimento vigente está desatualizado em relação à última assembleia.", due_date: 20.days.from_now, tipo: "warning" },
  { titulo: "Entrega do Relatório de Execução Anual", category: "Contábil", mensagem: "Documento obrigatório para manutenção da certificação CEBAS.", due_date: 5.days.ago, tipo: "error" },
  { titulo: "Atualização de Laudos de Vigilância Sanitária", category: "Infraestrutura", mensagem: "Laudos vencidos podem comprometer a auditoria externa.", due_date: 12.days.from_now, tipo: "warning" },
  { titulo: "Assinatura de Novos Termos de Bolsa", category: "Gratuidade", mensagem: "Bolsistas do ciclo 2026 ainda aguardam assinatura do termo de concessão.", due_date: 8.days.from_now, tipo: "warning" },
  { titulo: "Revisão de Contratos do Corpo Docente", category: "Institucional", mensagem: "Contratos de dois professores vencem no fim do trimestre.", due_date: 18.days.from_now, tipo: "warning" }
]

alertas_data.each do |alerta|
  Alerta.create!(alerta) rescue nil
end

puts "==> 📄 Criando Documentos do Checklist CEBAS (mínimo 6 por categoria)..."

status_cycle = [:aprovado, :em_revisao, :pendente, :correcao_solicitada, :nao_aplicavel, :aprovado, :em_revisao, :pendente]

comentarios_possiveis = [
  "Documento recebido, iniciando conferência.",
  "Favor confirmar a data de validade impressa no rodapé.",
  "Tudo certo, segue para o próximo ciclo de revisão.",
  "Aguardando retorno da instituição sobre este item.",
  "Verificado com a contabilidade, dados batem com o relatório anual."
]

motivos_correcao = [
  "Arquivo ilegível ou sem carimbo.",
  "Documento fora do prazo de validade.",
  "Falta assinatura do representante legal.",
  "Versão enviada não corresponde ao modelo solicitado."
]

checklist_por_categoria = {
  cat_mantenedora => [
    "Estatuto Social Consolidado",
    "Ata de Eleição da Atual Diretoria",
    "Cartão CNPJ (Matriz e Filiais)",
    "Declaração de Cumprimento dos Requisitos CEBAS",
    "Regimento Interno Atualizado",
    "Certidão de Regularidade no Conselho Municipal"
  ],
  cat_mantidas => [
    "Ato de Credenciamento da Mantida",
    "Declaração de Perfil Socioeconômico",
    "Relação Nominal de Bolsistas",
    "Termo de Concessão de Bolsas",
    "Editais de Seleção de Bolsistas",
    "Plano Pedagógico Institucional"
  ],
  cat_contabil => [
    "Demonstrações Contábeis Consolidadas",
    "Parecer de Auditoria Independente",
    "Notas Explicativas às Demonstrações",
    "Balancete Mensal Consolidado",
    "Relatório de Execução Financeira",
    "Extrato Bancário Consolidado"
  ],
  cat_trabalhista => [
    "Folha de Pagamento Consolidada",
    "Guias de Recolhimento do FGTS",
    "Certidão Negativa de Débitos Trabalhistas",
    "Relação de Empregados (RAIS)",
    "Comprovante de Recolhimento do INSS",
    "Acordo Coletivo de Trabalho Vigente"
  ],
  cat_tributario => [
    "CND Federal (Receita/PGFN)",
    "Certidão de Regularidade do FGTS",
    "Comprovantes de Recolhimento de Tributos",
    "Declaração de Isenção Tributária",
    "Certidão Negativa Municipal",
    "Certidão Negativa Estadual"
  ],
  cat_infra => [
    "Laudo de Vistoria do Corpo de Bombeiros",
    "Alvará de Funcionamento",
    "Laudo de Acessibilidade",
    "Plano de Manutenção Predial",
    "Certificado de Vigilância Sanitária",
    "Apólice de Seguro Predial"
  ],
  cat_docente => [
    "Relação de Professores Habilitados",
    "Comprovantes de Titulação Docente",
    "Plano de Capacitação Continuada",
    "Contratos de Trabalho Docente",
    "Registro Funcional dos Professores",
    "Certificados de Formação Continuada"
  ],
  cat_social => [
    "Relatório de Atividades Extracurriculares",
    "Plano de Ação Social Anual",
    "Parcerias com Entidades Comunitárias",
    "Registro de Beneficiários de Projetos",
    "Prestação de Contas de Projetos Sociais",
    "Relatório de Impacto Social"
  ],
  cat_bolsistas => [
    "Termo de Concessão de Bolsa Integral",
    "Termo de Concessão de Bolsa Parcial",
    "Relação de Benefícios Concedidos",
    "Comprovantes de Renda dos Bolsistas",
    "Relatório de Acompanhamento Socioeconômico",
    "Declaração de Matrícula dos Bolsistas"
  ],
  cat_auditoria => [
    "Relatório de Auditoria Externa Anual",
    "Plano de Ação Corretiva",
    "Parecer sobre Controles Internos",
    "Carta de Recomendações da Auditoria",
    "Certificado de Conformidade",
    "Relatório de Follow-up da Auditoria Anterior"
  ]
}

total_criados = 0

checklist_por_categoria.each do |categoria, nomes|
  nomes.each_with_index do |nome, idx|
    status = status_cycle[idx % status_cycle.length]
    entidade = [instituicao, instituicao, instituicao, instituicao_secundaria, instituicao_terciaria].sample

    item = entidade.document_items.create!(
      category: categoria,
      name: nome,
      orientation: "Documento obrigatório conforme checklist regulatório do CEBAS.",
      mandatory: status != :nao_aplicavel,
      due_date: Date.current + rand(5..90).days,
      status: status,
      cycle: "2026",
      position: idx + 1
    )

    total_criados += 1
    next if status == :pendente

    correction_reason = status == :correcao_solicitada ? motivos_correcao.sample : nil

    versao = begin
      item.document_versions.create!(
        version_number: 1,
        status: status,
        correction_reason: correction_reason,
        uploaded_by: cliente,
        reviewed_by: advogado,
        reviewed_at: rand(1..30).days.ago
      )
    rescue
      next
    end

    audit_action = case status
                   when :aprovado then "approval"
                   when :correcao_solicitada then "correction_request"
                   else "status_change"
                   end

    begin
      item.audit_logs.create!(
        document_version: versao,
        user: advogado,
        action: audit_action,
        from_status: "em_revisao",
        to_status: status,
        comment: correction_reason || "Documento avaliado pela equipe de compliance."
      )
    rescue
      nil
    end

    if [:aprovado, :correcao_solicitada].include?(status) && rand < 0.6
      begin
        item.document_comments.create!(
          user: [advogado, cliente].sample,
          body: correction_reason || comentarios_possiveis.sample
        )
      rescue
        nil
      end
    end
  end
end

puts "    -> #{total_criados} documentos de checklist criados em #{checklist_por_categoria.size} categorias."

puts "==> 🌪️ Criando 72 Documentos de Fechamento Mensal (Histórico de 2 Anos)..."
meses = %w[Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro]
anos = [2025, 2026]

anos.each do |ano|
  meses.each_with_index do |mes, idx|
    vencimento_base = Date.new(ano, idx + 1, 15)

    # Contábil
    instituicao.document_items.create!(
      category: cat_contabil, name: "Extrato Bancário Consolidado - #{mes}/#{ano}",
      orientation: "Demonstrativo completo.", mandatory: true, due_date: vencimento_base + 10.days,
      status: ano == 2025 ? :aprovado : :pendente, cycle: ano.to_s, position: idx + 1
    )

    # Trabalhista
    instituicao.document_items.create!(
      category: cat_trabalhista, name: "Folha de Pagamento - #{mes}/#{ano}",
      orientation: "Relatório de salários.", mandatory: true, due_date: vencimento_base + 15.days,
      status: (ano == 2025 || idx < 6) ? :aprovado : :pendente, cycle: ano.to_s, position: idx + 1
    )

    # Fiscal
    doc_fiscal = instituicao.document_items.create!(
      category: cat_tributario, name: "Comprovantes INSS/FGTS - #{mes}/#{ano}",
      orientation: "Guias quitadas.", mandatory: true, due_date: vencimento_base + 20.days,
      status: (ano == 2026 && idx == 5) ? :correcao_solicitada : ((ano == 2025 || idx < 5) ? :aprovado : :pendente),
      cycle: ano.to_s, position: idx + 1
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
          doc_fiscal.audit_logs.create!(
            document_version: v,
            user: advogado,
            action: status_v == :correcao_solicitada ? "correction_request" : "status_change",
            from_status: "pendente",
            to_status: status_v.to_s,
            comment: motivo || "Ciclo de revisão #{num}."
          )
        rescue
          nil
        end
      end
    end
  end
end

puts "==> ✅ SEED FINALIZADO COM SUCESSO!"
puts "    Usuários: #{User.count} | Instituições: #{Institution.count} | Categorias: #{Category.count}"
puts "    Documentos: #{DocumentItem.count} | Versões: #{DocumentVersion.count} | Comentários: #{DocumentComment.count}"
puts "    Logs de auditoria: #{AuditLog.count} | Bolsistas: #{Bolsista.count} | Alertas: #{Alerta.count}"