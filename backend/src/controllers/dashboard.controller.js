const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.metrics = async (req, res) => {
  const companyId = req.user.companyId;
  const now = new Date();

  const [
    totalContracts,
    activeContracts,
    pendingSignatures,
    expiringContracts,
    totalObras,
    obrasEmAndamento,
    totalCustos
  ] = await Promise.all([
    prisma.contract.count({ where: { companyId } }),
    prisma.contract.count({ where: { companyId, status: 'signed' } }),
    prisma.contract.count({ where: { companyId, status: 'pending_signature' } }),
    prisma.contract.count({
      where: {
        companyId,
        status: 'signed',
        endDate: { lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.obra.count({ where: { companyId } }),
    prisma.obra.count({ where: { companyId, status: 'execução' } }),
    prisma.obraCusto.aggregate({
      where: { obra: { companyId } },
      _sum: { amount: true }
    })
  ]);

  res.json({
    totalContracts,
    activeContracts,
    pendingSignatures,
    expiringContracts,
    totalObras,
    obrasEmAndamento,
    totalCustos: totalCustos._sum.amount || 0
  });
};