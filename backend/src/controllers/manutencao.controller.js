const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const items = await prisma.obraManutencao.findMany({
    where: { obraId: req.params.obraId },
    orderBy: { date: 'desc' }
  });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.date) {
      let s = body.date;
      if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
        s = `${s}T00:00:00Z`;
      }
      const d = new Date(s);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: 'Invalid date. Expected ISO-8601 DateTime.' });
      }
      body.date = d;
    }

    const item = await prisma.obraManutencao.create({
      data: { ...body, obraId: req.params.obraId }
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  await prisma.obraManutencao.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
};