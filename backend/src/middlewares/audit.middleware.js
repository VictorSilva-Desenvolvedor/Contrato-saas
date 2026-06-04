const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const audit = (action, entity) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    try {
      if (req.user && data?.id) {
        await prisma.auditLog.create({
          data: {
            userId:   req.user.id,
            action,
            entity,
            entityId: data.id
          }
        });
      }
    } catch (_) {}
    return originalJson(data);
  };
  next();
};

module.exports = audit;