# CEBAS 360 - Plataforma de Gestão Documental

Este repositório contém a solução desenvolvida para o Desafio Técnico de Desenvolvedor(a) Full Stack. A plataforma CEBAS 360 substitui o controle manual (Google Drive + Word) por um sistema centralizado de acompanhamento, envio e auditoria de documentos para instituições parceiras.

O projeto foi estruturado em um **Monorepo**, contendo o back-end em Ruby on Rails e o front-end em Next.js.

---

## 🛠 Stack Tecnológica

* **Front-end:** Next.js (App Router), React, Tailwind CSS, Componentes visuais fiéis ao protótipo.
* **Back-end:** Ruby on Rails 8 (Modo API).
* **Banco de Dados:** PostgreSQL hospedado no Supabase.
* **Armazenamento em Nuvem:** Google Drive API v3 integrada via OAuth 2.0 (User Refresh Token) com suporte a contas de grande capacidade e mecanismo de *Fallback* local de segurança.
* **Padrão Arquitetural:** Backend For Frontend (BFF) com rotas de proxy no Next.js para proteger tokens de autenticação via cookies `HttpOnly`.

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
   Priorizei a estabilidade da plataforma estabelecendo o PostgreSQL como banco de dados. Isso garante confiabilidade no controle de status, histórico de versões (versionamento incremental no banco de dados) e trilhas de auditoria.

2. **Integração Robusta com o Google Drive (OAuth 2.0):**
   Para contornar as restrições de cota zero em Contas de Serviço (Service Accounts) da Google, a aplicação foi migrada para o fluxo OAuth 2.0 com *Refresh Tokens*, permitindo o uso direto de contas de grande capacidade (5TB+). Adicionou-se também um sistema de *Fallback* para armazenamento local (`public/uploads`) para garantir resiliência contra falhas externas de rede.

3. **Backend For Frontend (BFF) e Segurança:**
   No frontend, utilizei uma rota de Proxy (interceptador) no Next.js. O React não fala diretamente com o Rails. Ele fala com o proxy, que anexa tokens JWT guardados em cookies `HttpOnly`. Essa escolha blinda a aplicação contra falhas de CORS e protege o JWT de ataques XSS.

4. **Renderização Estática para Knowledge Base:**
   Páginas informativas, como a "Base Normativa", foram construídas de forma 100% estática no Next.js (sem chamadas ao banco), garantindo carregamento instantâneo.

---

## 🤖 Uso de IA no desenvolvimento

Ferramentas de IA (como ChatGPT, Claude, V0 e GitHub Copilot) foram utilizadas como assistentes de codificação de forma estratégica:
* **Refatoração de Componentes Front-end:** Utilizei IA para otimizar o Tailwind CSS e garantir que as cores, padding e componentes estáticos ficassem idênticos às paletas do Figma/Protótipo.
* **Troubleshooting de Arquitetura:** Auxílio no mapeamento de erros e configuração avançada de conectividade OAuth 2.0 com a API do Google Drive e tratamento de resiliência.
* **Mock de Dados:** Utilização de IA para gerar dados fictícios coerentes (beneficiários, regras CEBAS e metadados) para testar o comportamento visual das tabelas de paginação antes da conexão oficial com o PostgreSQL do Supabase. Todo o código gerado foi minuciosamente revisado e validado.
