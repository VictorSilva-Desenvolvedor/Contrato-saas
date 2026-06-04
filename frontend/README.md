# ContratoSaaS

## Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173