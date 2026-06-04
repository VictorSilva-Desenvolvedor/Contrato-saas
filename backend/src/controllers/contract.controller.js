const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const { status, type } = req.query;
  const where = { companyId: req.user.companyId };
  if (status) where.status = status;
  if (type)   where.type   = type;

  const contracts = await prisma.contract.findMany({
    where,
    include: { signatureRequests: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(contracts);
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body, companyId: req.user.companyId, status: 'draft' };
    const contract = await prisma.contract.create({ data });
    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  const contract = await prisma.contract.findUnique({
    where: { id: req.params.id },
    include: { signatureRequests: true, obras: true }
  });
  res.json(contract);
};

exports.update = async (req, res) => {
  try {
    const contract = await prisma.contract.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  await prisma.contract.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
};