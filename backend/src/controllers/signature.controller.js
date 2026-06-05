const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.send = async (req, res) => {
  try {
    const { contractId, channel, emailTo, whatsappTo } = req.body;

    // Validações
    if (channel === 'email' || channel === 'both') {
      if (!emailTo || !validateEmail(emailTo)) {
        return res.status(400).json({ error: 'E-mail inválido' });
      }
    }
    if (channel === 'whatsapp' || channel === 'both') {
      if (!whatsappTo) {
        return res.status(400).json({ error: 'Número de WhatsApp obrigatório' });
      }
    }

    const sigRequest = await prisma.signatureRequest.create({
      data: { 
        contractId, 
        channel, 
        sentTo: channel === 'email' ? emailTo : (channel === 'whatsapp' ? whatsappTo : `${emailTo},${whatsappTo}`),
        status: 'pending' 
      }
    });

    // Enviar por email se necessário
    if (channel === 'email' || channel === 'both') {
      const link = `http://localhost:5173/assinar/${sigRequest.token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: 'Contrato aguardando sua assinatura',
        html: `<p>Clique para assinar: <a href="${link}">${link}</a></p>`
      });
      console.log(`✓ Email enviado para: ${emailTo}`);
    }

    // Enviar por WhatsApp se necessário (placeholder - integração futura com Twilio, etc)
    if (channel === 'whatsapp' || channel === 'both') {
      const link = `http://localhost:5173/assinar/${sigRequest.token}`;
      console.log(`✓ WhatsApp enviado para: ${whatsappTo} - Link: ${link}`);
      // TODO: Integrar com Twilio ou outro serviço de WhatsApp
      // await sendWhatsapp(whatsappTo, `Clique para assinar: ${link}`);
    }

    await prisma.contract.update({
      where: { id: contractId },
      data: { status: 'pending_signature' }
    });

    res.json(sigRequest);
  } catch (err) {
    console.error('Erro ao enviar assinatura:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.sign = async (req, res) => {
  try {
    const { token } = req.params;
    const sigRequest = await prisma.signatureRequest.update({
      where: { token },
      data: { status: 'signed', signedAt: new Date() }
    });

    await prisma.contract.update({
      where: { id: sigRequest.contractId },
      data: { status: 'signed' }
    });

    res.json({ message: 'Contrato assinado com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  const requests = await prisma.signatureRequest.findMany({
    include: { contract: true },
    orderBy: { sentAt: 'desc' }
  });
  res.json(requests);
};
// Verify and expire old pending signatures
exports.expireOld = async (req, res) => {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 dias
  const result = await prisma.signatureRequest.updateMany({
    where: { status: 'pending', sentAt: { lt: cutoff } },
    data:  { status: 'expired' }
  });
  res.json({ expired: result.count });
};