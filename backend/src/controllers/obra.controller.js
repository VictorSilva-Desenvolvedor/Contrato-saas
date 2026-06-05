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

    const obra = await prisma.obra.create({
      data: {
        ...body,
        companyId: req.user.companyId,
        steps: {
          create: [
            { title: 'Vistoria inicial',      phase: 'planejamento' },
            { title: 'Aprovação do projeto',  phase: 'planejamento' },
            { title: 'Mobilização',           phase: 'execução' },
            { title: 'Execução principal',    phase: 'execução' },
            { title: 'Acabamento',            phase: 'execução' },
            { title: 'Vistoria final',        phase: 'entrega' },
            { title: 'Entrega ao cliente',    phase: 'entrega' }
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

    const obra = await prisma.obra.update({
      where: { id: req.params.id },
      data: body
    });
    res.json(obra);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStep = async (req, res) => {
  const step = await prisma.obraStep.update({
    where: { id: req.params.stepId },
    data: { done: req.body.done, doneAt: req.body.done ? new Date() : null }
  });
  res.json(step);
};

exports.addCusto = async (req, res) => {
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

    const custo = await prisma.obraCusto.create({
      data: { ...body, obraId: req.params.id }
    });
    res.json(custo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addVistoria = async (req, res) => {
  const vistoria = await prisma.obraVistoria.create({
    data: { ...req.body, obraId: req.params.id }
  });
  res.json(vistoria);
};
exports.addVistoriaComFotos = async (req, res) => {
  try {
    const { type, description, photos } = req.body;
    // photos = array de paths vindos do upload
    const vistoria = await prisma.obraVistoria.create({
      data: { type, description, photos: photos || [], obraId: req.params.id }
    });
    res.json(vistoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};