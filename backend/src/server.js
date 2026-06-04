const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth',      require('./routes/auth.routes.js'));
app.use('/api/contracts', require('./routes/contract.routes'));
app.use('/api/templates', require('./routes/template.routes'));
app.use('/api/obras',     require('./routes/obra.routes'));
app.use('/api/signatures',require('./routes/signature.routes'));
app.use('/api/purchase-orders', require('./routes/purchaseOrder.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.listen(process.env.PORT || 3333, () => {
  console.log(`🚀 Server rodando na porta ${process.env.PORT}`);
});