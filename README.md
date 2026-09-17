# CEBAS 360 - Plataforma de Gestão Documental

Este repositório contém a solução desenvolvida para o Desafio Técnico de Desenvolvedor(a) Full Stack. A plataforma CEBAS 360 substitui o controle manual (Google Drive + Word) por um sistema centralizado de acompanhamento, envio e auditoria de documentos para instituições parceiras.

O projeto foi estruturado em um **Monorepo**, contendo o back-end em Ruby on Rails e o front-end em Next.js.

---

## 🛠 Stack Tecnológica

* **Front-end:** Next.js (App Router), React, Tailwind CSS, Componentes visuais fiéis ao protótipo.
* **Back-end:** Ruby on Rails 8 (Modo API).
* **Banco de Dados:** PostgreSQL hospedado no Supabase.
* **Padrão Arquitetural:** Backend For Frontend (BFF) com rotas de proxy no Next.js para proteger tokens de autenticação via cookies `HttpOnly`.

---

## ⚙️ Como rodar localmente

Certifique-se de ter o Ruby, Node.js e PostgreSQL instalados na sua máquina.

### 1. Clonando o repositório
```bash

git clone https://github.com/Rodrigo5431/cebas-360.git
```
```
cd cebas-360
```

### 2. Configurando o Back-end (Rails)
Abra uma nova aba do terminal e navegue até a pasta do backend:
```bash
cd backend
```
Instale as dependências:
```bash
bundle install
```
Crie um arquivo `.env` na raiz da pasta `backend` com a URL do seu banco de dados:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@SEU-HOST.supabase.co:5432/postgres"
```
Prepare o banco de dados e inicie o servidor:
```bash
rails db:migrate
```
```
rails server
```
> O backend rodará em `http://localhost:3000`

### 3. Configurando o Front-end (Next.js)
Abra outra aba no terminal e navegue até a pasta do frontend:
```bash
cd frontend
```
Instale as dependências:
```bash
npm install
```
Crie um arquivo `.env` na raiz da pasta `frontend` apontando para o Rails:
```env
API_URL="http://127.0.0.1:3000"
```
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
> O frontend rodará em `http://localhost:3001` (Acesse por aqui para usar a aplicação).

---

## 📐 Decisões de Arquitetura

1. **Uso de Banco de Dados Relacional (PostgreSQL/Supabase):**
   Embora o desafio sugerisse a integração com o Google Drive como desejável, priorizei a estabilidade da plataforma estabelecendo o PostgreSQL como a fonte da verdade. Isso garante confiabilidade no controle de status, histórico de versões (versionamento no banco) e trilhas de auditoria, evitando os gargalos clássicos de depender da API do Drive como "banco de dados primário".

2. **Backend For Frontend (BFF) e Segurança:**
   No frontend, utilizei uma rota de Proxy (interceptador) no Next.js. O React não fala diretamente com o Rails. Ele fala com o proxy, que anexa tokens JWT guardados em cookies `HttpOnly`. Essa escolha blinda a aplicação contra falhas de CORS e protege o JWT de ataques XSS.

3. **Renderização Estática para Knowledge Base:**
   Páginas informativas, como a "Base Normativa", foram construídas de forma 100% estática no Next.js (sem chamadas ao banco), garantindo carregamento instantâneo.

---

## 🚫 O que foi deixado de fora e por quê

* **Separação de Perfis de Acesso (RBAC):** Conforme exigido no escopo obrigatório do desafio, a plataforma não possui distinção de visualização entre "Instituição" e "Advogado". Existe um login simples apenas para coletar o e-mail/nome do operador e alimentar a trilha de auditoria.
* **Integração profunda com Google Drive API:** Diante do prazo, optei por focar na completude das funcionalidades obrigatórias e na estrutura sólida de um storage via Rails (Active Storage ou Cloud próprio). Deixei a complexidade de tokens OAuth do Google para uma etapa posterior, preferindo um upload robusto que não quebre caso a API do Drive estivesse indisponível.
* **OCR e Leitura Autônoma de PDFs:** Funcionalidade fora do escopo inicial da MVP.

---

## 🤖 Uso de IA no desenvolvimento

Ferramentas de IA (como ChatGPT e GitHub Copilot) foram utilizadas como assistentes de codificação de forma estratégica:
* **Refatoração de Componentes Front-end:** Utilizei IA para otimizar o Tailwind CSS e garantir que as cores, padding e componentes estáticos (como a tela de Base Normativa) ficassem idênticos às paletas do Figma/Protótipo.
* **Troubleshooting de Arquitetura:** Auxílio no mapeamento de erros 500 durante a comunicação do proxy Next.js com o Rails, ajudando a criar blocos blindados com `rescue` enquanto as tabelas do banco não existiam.
* **Mock de Dados:** Utilização de IA para gerar dados fictícios coerentes (beneficiários, regras CEBAS e metadados) para testar o comportamento visual das tabelas de paginação antes da conexão oficial com o PostgreSQL do Supabase. Todo o código gerado foi minuciosamente revisado e validado.
