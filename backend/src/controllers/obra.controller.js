const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const obras = await prisma.obra.findMany({
    where: { companyId: req.user.companyId },
    include: { custos: true, steps: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(obras);
};

exports.create = async (req, res) => {
  try {
    const obra = await prisma.obra.create({
      data: {
        ...req.body,
        companyId: req.user.companyId,
        steps: {
          create: [
            { title: 'Vistoria inicial',      phase: 'planejamento' },
            { title: 'Aprovação do projeto',  phase: 'planejamento' },
            { title: 'Mobilização',           phase: 'execução' },
            { title: 'Execução principal',    phase: 'execução' },
            { title: 'Acabamento',            phase: 'execução' },
            { title: 'Vistoria final',        phase: 'entrega' },
            { title: 'Entrega ao cliente',    phase: 'entrega' },
          ]
        }
      },
      include: { steps: true }
    });
    res.json(obra);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  const obra = await prisma.obra.findUnique({
    where: { id: req.params.id },
    include: { steps: true, vistorias: true, custos: true, purchaseOrders: true, contract: true }
  });
  res.json(obra);
};

exports.update = async (req, res) => {
  const obra = await prisma.obra.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(obra);
};

exports.updateStep = async (req, res) => {
  const step = await prisma.obraStep.update({
    where: { id: req.params.stepId },
    data: { done: req.body.done, doneAt: req.body.done ? new Date() : null }
  });
  res.json(step);
};

exports.addCusto = async (req, res) => {
  const custo = await prisma.obraCusto.create({
    data: { ...req.body, obraId: req.params.id }
  });
  res.json(custo);
};

exports.addVistoria = async (req, res) => {
  const vistoria = await prisma.obraVistoria.create({
    data: { ...req.body, obraId: req.params.id }
  });
  res.json(vistoria);
};