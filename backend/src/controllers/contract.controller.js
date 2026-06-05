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
    const body = { ...req.body };
    // Normalize and validate dates: accept YYYY-MM-DD or full ISO datetime
    for (const field of ['startDate', 'endDate']) {
      if (body[field]) {
        let s = body[field];
        if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
          s = `${s}T00:00:00Z`;
        }
        const d = new Date(s);
        if (isNaN(d.getTime())) {
          return res.status(400).json({ error: `Invalid date for ${field}. Expected ISO-8601 DateTime.` });
        }
        body[field] = d;
      }
    }

    const data = { ...body, companyId: req.user.companyId, status: 'draft' };
    console.log('Creating contract with data:', data);
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
    const body = { ...req.body };
    for (const field of ['startDate', 'endDate']) {
      if (body[field]) {
        let s = body[field];
        if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
          s = `${s}T00:00:00Z`;
        }
        const d = new Date(s);
        if (isNaN(d.getTime())) {
          return res.status(400).json({ error: `Invalid date for ${field}. Expected ISO-8601 DateTime.` });
        }
        body[field] = d;
      }
    }

    const contract = await prisma.contract.update({
      where: { id: req.params.id },
      data: body
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