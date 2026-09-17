AuditLog.delete_all
DocumentVersion.delete_all
DocumentItem.delete_all
Category.delete_all
Institution.delete_all
User.delete_all

puts "==> Criando usuários..."
advogado = User.create!(
  name: "Dr. Roberto Augusto",
  email: "advogado@duopen.com.br",
  password: "password123"
)

cliente = User.create!(
  name: "Coordenação Educacional",
  email: "contato@instituto.org.br",
  password: "password123"
)

puts "==> Criando Instituição de Demonstração..."
instituicao = Institution.create!(
  name: "Instituto Educacional Horizonte",
  cnpj: "12.345.678/0001-90"
)

puts "==> Criando Categorias..."
cat_mantenedora = Category.create!(name: "Mantenedora", position: 1)
cat_mantidas    = Category.create!(name: "Mantida(s)", position: 2)

puts "==> Populando Documentos da Mantenedora..."
itens_mantenedora = [
  {
    name: "Declaração de cumprimento dos requisitos CEBAS",
    orientation: "Modelo anexo na pasta.",
    mandatory: true,
    due_date: Date.current + 7.days,
    status: :em_revisao
  },
  {
    name: "Cartão CNPJ (Mantenedora e Filiais Educacionais)",
    orientation: "Comprovante de inscrição e de situação cadastral atualizado da matriz e filiais.",
    mandatory: true,
    due_date: Date.current + 3.days,
    status: :aprovado
  },
  {
    name: "Ata de Eleição da Atual Diretoria",
    orientation: "Encaminhar cópia autenticada da ata de eleição do mandato vigente dos dirigentes da entidade (representantes estatutários).",
    mandatory: true,
    due_date: Date.current + 2.days,
    status: :correcao_solicitada
  },
  {
    name: "Estatuto com cláusula de destinação do patrimônio",
    orientation: "Encaminhar cópia autenticada do Estatuto Social devidamente registrado no RCPJ. Deve conter cláusula explícita prevendo que, em caso de dissolução ou extinção, o eventual patrimônio remanescente será destinado a entidades beneficentes certificadas ou entidades públicas.",
    mandatory: true,
    due_date: Date.current + 10.days,
    status: :pendente
  },
  {
    name: "Relatório de Execução Anual",
    orientation: "Conter indicação do ano de análise e descrição clara das atividades realizadas, total de alunos matriculados e bolsistas (integrais e parciais), e montante discriminado de recursos destinados aos benefícios. Consolidado pela mantenedora, mas referindo-se a cada mantida.",
    mandatory: true,
    due_date: Date.current + 15.days,
    status: :pendente
  },
  {
    name: "Declaração INEP",
    orientation: "Modelo anexo na pasta.",
    mandatory: true,
    due_date: Date.current + 20.days,
    status: :pendente
  },
  {
    name: "Demonstrações Contábeis (BP, DRE, DMPL, NE, DFC)",
    orientation: "Conter informações de 2 exercícios fiscais. Escrituração com receitas/despesas segregadas por gratuidade. Notas explicativas detalhando quantitativo de alunos pagantes e bolsistas e o montante de recursos por bolsa. Observar princípio da Oportunidade e Competência.",
    mandatory: true,
    due_date: Date.current + 4.days,
    status: :em_revisao
  },
  {
    name: "Parecer de Auditoria Independente (> R$4.800.000,00)",
    orientation: "Obrigatório para entidades com receita bruta anual superior ao limite legal estabelecido.",
    mandatory: false,
    due_date: Date.current + 30.days,
    status: :nao_aplicavel
  },
  {
    name: "CND Receita Federal / PGFN",
    orientation: "Certidão Conjunta Negativa de Débitos relativos a Tributos Federais e à Dívida Ativa da União dentro do prazo de validade.",
    mandatory: true,
    due_date: Date.current + 1.day,
    status: :aprovado
  },
  {
    name: "Regularidade do FGTS",
    orientation: "Certificado de Regularidade do FGTS (CRF) emitido pela Caixa Econômica Federal atualizado.",
    mandatory: true,
    due_date: Date.current + 1.day,
    status: :aprovado
  }
]

itens_mantenedora.each_with_index do |attrs, idx|
  item = instituicao.document_items.create!(attrs.merge(category: cat_mantenedora, position: idx + 1))
  
  if item.correcao_solicitada?
    v1 = item.document_versions.create!(
      uploaded_by: cliente,
      reviewed_by: advogado,
      status: :correcao_solicitada,
      correction_reason: "O documento enviado não contém a autenticação cartorária em todas as folhas conforme solicitado na orientação.",
      reviewed_at: 1.day.ago
    )
    item.audit_logs.create!(
      document_version: v1,
      user: advogado,
      action: :correction_request,
      from_status: :em_revisao,
      to_status: :correcao_solicitada,
      comment: v1.correction_reason
    )
  end
end

puts "==> Populando Documentos das Mantidas..."
itens_mantidas = [
  {
    name: "Ato de Credenciamento / Autorização de Funcionamento",
    orientation: "Portarias de credenciamento ou autorização de funcionamento expedidas pelo órgão competente do sistema de ensino.",
    mandatory: true,
    due_date: Date.current + 12.days,
    status: :pendente
  },
  {
    name: "Declaração de Perfil Socioeconômico",
    orientation: "Modelo anexo na pasta demonstrando a apuração de renda per capita de até 1,5 salário mínimo para integral e até 3 salários mínimos para parcial.",
    mandatory: true,
    due_date: Date.current + 8.days,
    status: :pendente
  },
  {
    name: "Identificação dos Dirigentes + Currículos",
    orientation: "Destacar experiência acadêmica e administrativa de cada membro no exercício anterior ao protocolo. Os cargos devem corresponder rigorosamente ao regimento interno.",
    mandatory: true,
    due_date: Date.current + 6.days,
    status: :em_revisao
  },
  {
    name: "Relação Nominal de Bolsistas",
    orientation: "Planilha EXCEL enumerada, discriminando alunos por percentual de bolsa (integrais e parciais), segregada por educação básica, profissional e superior.",
    mandatory: true,
    due_date: Date.current + 5.days,
    status: :pendente
  },
  {
    name: "Termo de Concessão de Bolsas e Benefícios",
    orientation: "A CGCEBAS exige termos individuais firmados com bolsistas e beneficiários devidamente assinados.",
    mandatory: true,
    due_date: Date.current + 14.days,
    status: :pendente
  },
  {
    name: "Regimento Interno",
    orientation: "Cópia do regimento interno vigente e aprovado pelo órgão colegiado competente da mantida.",
    mandatory: true,
    due_date: Date.current + 15.days,
    status: :aprovado
  },
  {
    name: "Editais de Seleção",
    orientation: "Publicações que comprovem a ampla divulgação dos critérios e processos de concessão das bolsas de estudo.",
    mandatory: true,
    due_date: Date.current + 18.days,
    status: :pendente
  }
]

itens_mantidas.each_with_index do |attrs, idx|
  instituicao.document_items.create!(attrs.merge(category: cat_mantidas, position: idx + 1))
end

puts "==> Seeds finalizados com sucesso!"