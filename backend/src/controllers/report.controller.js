const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.contractsReport = async (req, res) => {
  const companyId = req.user.companyId;
  const { startDate, endDate, status, type } = req.query;

  const where = { companyId };
  if (status)    where.status    = status;
  if (type)      where.type      = type;
  if (startDate) {
    let s = startDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s = `${s}T00:00:00Z`;
    const d = new Date(s);
    if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid startDate query param' });
    where.startDate = { gte: d };
  }
  if (endDate) {
    let s = endDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s = `${s}T23:59:59Z`;
    const d = new Date(s);
    if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid endDate query param' });
    where.endDate = { lte: d };
  }

  const contracts = await prisma.contract.findMany({
    where,
    include: { signatureRequests: true },
    orderBy: { createdAt: 'desc' }
  });

  const summary = {
    total:             contracts.length,
    totalValue:        contracts.reduce((s, c) => s + c.value, 0),
    byStatus: {
      draft:             contracts.filter(c => c.status === 'draft').length,
      pending_signature: contracts.filter(c => c.status === 'pending_signature').length,
      signed:            contracts.filter(c => c.status === 'signed').length,
    },
    byType: contracts.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {})
  };

  res.json({ summary, contracts });
};

exports.obrasReport = async (req, res) => {
  const companyId = req.user.companyId;

  const obras = await prisma.obra.findMany({
    where: { companyId },
    include: { custos: true, purchaseOrders: true, steps: true }
  });

  const report = obras.map(o => {
    const realizado    = o.custos.reduce((s, c) => s + c.amount, 0);
    const totalOC      = o.purchaseOrders.reduce((s, p) => s + p.total, 0);
    const stepsDone    = o.steps.filter(s => s.done).length;
    const stepsTotal   = o.steps.length;
    const overBudget   = realizado > o.budget;

    return {
      id:          o.id,
      name:        o.name,
      status:      o.status,
      budget:      o.budget,
      realizado,
      totalOC,
      balance:     o.budget - realizado,
      overBudget,
      progress:    stepsTotal ? Math.round(stepsDone / stepsTotal * 100) : 0
    };
  });

  const summary = {
    total:       obras.length,
    totalBudget: obras.reduce((s, o) => s + o.budget, 0),
    totalGasto:  report.reduce((s, o) => s + o.realizado, 0),
    overBudget:  report.filter(o => o.overBudget).length
  };

  res.json({ summary, obras: report });
};

exports.signaturesReport = async (req, res) => {
  const companyId = req.user.companyId;

  const requests = await prisma.signatureRequest.findMany({
    where: { contract: { companyId } },
    include: { contract: true },
    orderBy: { sentAt: 'desc' }
  });

  const summary = {
    total:   requests.length,
    signed:  requests.filter(r => r.status === 'signed').length,
    pending: requests.filter(r => r.status === 'pending').length,
    expired: requests.filter(r => r.status === 'expired').length,
  };

  res.json({ summary, requests });
};