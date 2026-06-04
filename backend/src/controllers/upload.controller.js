const multer = require('multer');
const path   = require('path');
const { v4: uuid } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  }
});

exports.upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  }
});

exports.saveUpload = async (req, res) => {
  try {
    const { entity, entityId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const record = await prisma.upload.create({
      data: {
        entity,
        entityId,
        filename: file.originalname,
        path: `/uploads/${file.filename}`,
        mimetype: file.mimetype
      }
    });

    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listByEntity = async (req, res) => {
  const { entity, entityId } = req.params;
  const files = await prisma.upload.findMany({
    where: { entity, entityId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(files);
};