const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const orders = await prisma.purchaseOrder.findMany({
    include: { obra: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
};

exports.create = async (req, res) => {
  try {
    const order = await prisma.purchaseOrder.create({ data: req.body });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const order = await prisma.purchaseOrder.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(order);
};