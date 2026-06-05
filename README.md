# ContratoSaaS

Sistema de gerenciamento de contratos e obras com suporte a assinatura eletrônica, controle de obras, ordens de compra e gestão multi-tenant por empresa.

## Visão geral

ContratoSaaS é uma aplicação SaaS para empresas que precisam criar, gerenciar e assinar contratos, além de acompanhar obras, custos, ordens de compra e relatórios operacionais.

A solução é composta por duas camadas:
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React + Vite + Tailwind + Axios

## Funcionalidades principais

- Cadastro de empresas e usuários com roles administrativas
- Criação e gestão de templates de contrato
- Criação de contratos a partir de templates ou manualmente
- Envio de contratos para assinatura por email/WhatsApp
- Assinatura pública via token sem login
- Monitoramento de status de assinaturas
- Dashboard e relatórios de contratos e obras
- Gestão de obras, manutenção, custos e ordens de compra
- Upload de arquivos e fotos de vistoria
- Estrutura multi-tenant por empresa

## Casos de uso destacados

- Criar conta e empresa
- Criar template de contrato
- Criar contrato e salvar como rascunho
- Enviar contrato para assinatura e acompanhar status
- Assinar contrato com link público
- Monitorar fila de assinaturas
- Gerenciar vigência de contratos
- Criar obra vinculada a contrato
- Lançar custos e emitir ordens de compra
- Registrar manutenção e vistoria de obra

## Tecnologias

- Backend: `Node.js`, `Express`, `Prisma`, `PostgreSQL`, `bcryptjs`, `jsonwebtoken`, `multer`, `nodemailer`
- Frontend: `React`, `Vite`, `Tailwind CSS`, `Axios`, `React Router`, `Zustand`, `Recharts`
- Dev tools: `nodemon`, `ESLint`

## Estrutura do projeto

- `backend/`
  - `src/server.js` - servidor Express
  - `src/routes/` - rotas REST
  - `src/controllers/` - lógica de controle das entidades
  - `prisma/schema.prisma` - modelo de dados e migrações
  - `uploads/` - arquivos enviados pelo sistema
- `frontend/`
  - `src/main.jsx` e `src/App.jsx` - ponto de entrada React
  - `src/pages/` - páginas e rotas do app
  - `src/services/api.js` - cliente Axios para API
  - `src/store/authStore.js` - gerenciamento de autenticação

## Pré-requisitos

- Node.js 18+ ou compatível
- PostgreSQL
- Acesso a SMTP para envio de email (para notificações de assinatura)

## Instalação

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/contrato_saas"
JWT_SECRET="change_me"
PORT=3333
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
```

Depois execute:

```bash
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Se desejar alterar a URL do backend, crie ou ajuste o arquivo `.env` no `frontend` com:

```env
VITE_API_URL=http://localhost:3333/api
```

Em seguida:

```bash
npm run dev
```

## Executando a aplicação

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`

## Endpoints públicos importantes

- `GET /api/public/contract/:token` – obter dados do contrato para assinatura pública
- `PATCH /api/public/sign/:token` – assinar contrato via token público

## Notas adicionais

- O backend serve a pasta `uploads` como arquivos estáticos em `/uploads`
- A autenticação utiliza token JWT enviado pelo frontend no header `Authorization`
- O Prisma gerencia o banco de dados e as migrações estão em `backend/prisma/migrations`

## Próximos passos sugeridos

- Adicionar controle de permissões mais granular por roles
- Melhorar a interface de relatórios e dashboards
- Implementar notificações por WhatsApp via API externa
- Criar testes automatizados para backend e frontend

## Contato

Para dúvidas ou ajustes, abra uma issue no repositório ou entre em contato com o time responsável pelo desenvolvimento.
