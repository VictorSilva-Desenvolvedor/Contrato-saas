const express  = require('express');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos de upload como estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api/auth',           require('./routes/auth.routes'));
app.use('/api/contracts',      require('./routes/contract.routes'));
app.use('/api/templates',      require('./routes/template.routes'));
app.use('/api/obras',          require('./routes/obra.routes'));
app.use('/api/signatures',     require('./routes/signature.routes'));
app.use('/api/purchase-orders',require('./routes/purchaseOrder.routes'));
app.use('/api/dashboard',      require('./routes/dashboard.routes'));
app.use('/api/uploads',        require('./routes/upload.routes'));
app.use('/api/reports',        require('./routes/report.routes'));
app.use('/api/users',          require('./routes/user.routes'));

// Rota pública de assinatura (sem auth)
app.patch('/api/public/sign/:token', async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const sig = await prisma.signatureRequest.update({
      where: { token: req.params.token },
      data:  { status: 'signed', signedAt: new Date() }
    });
    await prisma.contract.update({
      where: { id: sig.contractId },
      data:  { status: 'signed' }
    });
    res.json({ message: 'Contrato assinado com sucesso!' });
  } catch {
    res.status(400).json({ error: 'Token inválido ou expirado' });
  }
});

app.get('/api/public/contract/:token', async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const sig = await prisma.signatureRequest.findUnique({
      where: { token: req.params.token },
      include: { contract: true }
    });
    if (!sig) return res.status(404).json({ error: 'Não encontrado' });
    res.json(sig);
  } catch {
    res.status(400).json({ error: 'Erro' });
  }
});

app.listen(process.env.PORT || 3333, () =>
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3333}`)
);