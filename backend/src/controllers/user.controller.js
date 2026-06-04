const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const users = await prisma.user.findMany({
    where: { companyId: req.user.companyId },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  res.json(users);
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'user', companyId: req.user.companyId },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { name, role } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { name, role },
    select: { id: true, name: true, email: true, role: true }
  });
  res.json(user);
};

exports.remove = async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
};

exports.auditLogs = async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    where: { userId: { in: (await prisma.user.findMany({
      where: { companyId: req.user.companyId },
      select: { id: true }
    })).map(u => u.id) }},
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  res.json(logs);
};