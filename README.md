# CEBAS 360 - Plataforma de Gestão Documental

Este repositório contém a solução desenvolvida para o Desafio Técnico de Desenvolvedor(a) Full Stack. A plataforma CEBAS 360 substitui o controle manual fragmentado (Google Drive + Word) por um sistema centralizado de acompanhamento, envio, auditoria e conferência de documentos para instituições do terceiro setor e ensino parceiras.

O projeto foi estruturado em um **Monorepo**, contendo o back-end em Ruby on Rails e o front-end em Next.js.

---

## 🛠 Stack Tecnológica

* **Front-end:** Next.js (App Router), React, Tailwind CSS, Lucide Icons e componentes visuais responsivos alinhados ao protótipo.
* **Back-end:** Ruby on Rails 8 (Modo API), ActionMailer para envio de notificações por e-mail.
* **Banco de Dados:** PostgreSQL hospedado no Supabase.
* **Armazenamento em Nuvem:** Google Drive API v3 integrada via OAuth 2.0 (User Refresh Token) com suporte a contas de grande capacidade e um mecanismo resiliente de *Fallback* local de segurança.
* **Padrão Arquitetural:** Backend For Frontend (BFF) com rotas de proxy no Next.js para proteger tokens de autenticação via cookies `HttpOnly`.

---

## 🚀 Funcionalidades Principais Entregues

1. **Visão Geral Dinâmica (Dashboard):** Indicadores em tempo real do percentual concluído, contadores de status (pendente, em revisão, aprovado, correção solicitada) e prazos de vencimento.
2. **Filtros Institucionais e por Ciclo/Ano:** Suporte a múltiplas instituições e múltiplos ciclos (ex: 2024, 2025, 2026), permitindo alternar contextos de forma isolada na mesma interface.
3. **Upload em Lote com Sugestão Inteligente:** Capacidade de arrastar múltiplos arquivos de uma só vez com leitura automatizada do nome do arquivo para sugerir a categoria correta no checklist.
4. **Versionamento Imutável e Trilha de Auditoria:** Substituições de arquivos geram novas versões (`v1`, `v2`, ...) sem apagar o histórico anterior, registrando quem enviou, quem conferiu e quando.
5. **Comentários Encadeados (Threads):** Histórico estruturado estilo chat por documento para apontamentos do advogado, mantendo todas as interações passadas preservadas.
6. **Notificações por E-mail Automatizadas:** Disparo integrado via ActionMailer avisando a instituição sempre que um documento é devolvido para correção.
7. **Exportação de Checklist:** Exportação dos dados filtrados para formato de planilha CSV para substituir planilhas manuais.

---

## ⚙️ Como rodar localmente

Certifique-se de ter o Ruby, Node.js e PostgreSQL instalados na sua máquina.

### 1. Clonando o repositório
```bash
git clone [https://github.com/Rodrigo5431/cebas-360.git](https://github.com/Rodrigo5431/cebas-360.git)
cd cebas-360
```

### 2. Configurando o Back-end (Rails)
Abra uma nova aba do terminal e navegue até a pasta do backend:
```bash
cd backend
bundle install
```
Crie um arquivo `.env` na raiz da pasta `backend` com as variáveis de conexão e do Google Drive:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@SEU-HOST.supabase.co:5432/postgres"
GOOGLE_DRIVE_FOLDER_ID=id_da_sua_pasta_no_drive
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REFRESH_TOKEN=seu_refresh_token_oauth
```
Prepare o banco de dados e inicie o servidor:
```bash
rails db:migrate
rails server
```
> O backend rodará em `http://localhost:3000`

### 3. Configurando o Front-end (Next.js)
Abra outra aba no terminal e navegue até a pasta do frontend:
```bash
cd frontend
npm install
```
Crie um arquivo `.env` na raiz da pasta `frontend` apontando para o Rails:
```env
API_URL="[http://127.0.0.1:3000](http://127.0.0.1:3000)"
```
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
> O frontend rodará em `http://localhost:3001` (Acesse por aqui para usar a aplicação).

---

## 📐 Decisões de Arquitetura

1. **Uso de Banco de Dados Relacional (PostgreSQL/Supabase):**
   Priorizei a estabilidade estabelecendo o PostgreSQL como fonte da verdade. Isso garante confiabilidade rigorosa no controle de status, versionamento incremental, tabelas relacionais de comentários encadeados e trilhas de auditoria imutáveis.

2. **Integração Robusta com o Google Drive (OAuth 2.0) e Fallback:**
   Para contornar as restrições de cota zero em Contas de Serviço (Service Accounts) da Google, a aplicação utiliza o fluxo OAuth 2.0 com *Refresh Tokens*, permitindo contas de grande capacidade (5TB+). Adicionou-se um sistema de *Fallback* automático para armazenamento local (`public/uploads`) para garantir resiliência absoluta caso a API externa esteja indisponível.

3. **Backend For Frontend (BFF) e Segurança:**
   No frontend, utilizei uma rota de Proxy (interceptador) no Next.js. O React não interage diretamente com o Rails de forma vulnerável, mas sim através do proxy, anexando tokens de sessão guardados em cookies `HttpOnly`. Essa escolha protege a aplicação contra falhas de CORS e ataques XSS.

4. **Modularidade e Escalabilidade (Ciclos e Instituições):**
   A modelagem de dados foi expandida para suportar múltiplos ciclos anuais (`cycle`) e chaves estrangeiras de instituições, permitindo a reutilização do mesmo checklist normativo em anos fiscais distintos por diferentes clientes do escritório.

---

## 🤖 Uso de IA no desenvolvimento

Ferramentas de IA (como ChatGPT, Claude, V0 e GitHub Copilot) foram utilizadas como assistentes de codificação de forma estratégica:
* **Refatoração de Componentes Front-end:** Utilização de IA para otimizar o Tailwind CSS e garantir que as cores, estados interativos e componentes estáticos ficassem idênticos às paletas do protótipo fornecido.
* **Arquitetura de Relações e Migrations:** Auxílio na estruturação das tabelas de comentários encadeados (`document_comments`) e refinamento das consultas SQL otimizadas com `Eager Loading`.
* **Configuração de Serviços (ActionMailer e OAuth):** Suporte no mapeamento de erros, configuração do pipeline de envio de e-mails de notificação e tratamento de resiliência do *Fallback* de arquivos.
* Todo o código gerado por IA foi minuciosamente revisado, testado de ponta a ponta e validado manualmente para garantir aderência total ao problema real do cliente.
