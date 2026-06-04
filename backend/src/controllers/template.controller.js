const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const templates = await prisma.contractTemplate.findMany({
    include: { fields: true }
  });
  res.json(templates);
};

exports.create = async (req, res) => {
  try {
    const { name, category, content, fields } = req.body;
    const template = await prisma.contractTemplate.create({
      data: {
        name, category, content,
        fields: { create: fields || [] }
      },
      include: { fields: true }
    });
    res.json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  const template = await prisma.contractTemplate.findUnique({
    where: { id: req.params.id },
    include: { fields: true }
  });
  res.json(template);
};

exports.remove = async (req, res) => {
  await prisma.contractTemplate.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
};