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
    const item = await prisma.obraManutencao.create({
      data: { ...req.body, obraId: req.params.obraId }
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