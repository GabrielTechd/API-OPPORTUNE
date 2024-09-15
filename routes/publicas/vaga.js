// routes/vagas.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Rota para listar uma vaga pelo ID
router.get('/vaga/:id', async (req, res) => {
  const vagaId = parseInt(req.params.id, 10);

  if (isNaN(vagaId)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    // Buscar a vaga pelo ID
    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: {
        empresa: true, // Inclui dados da empresa relacionada
      },
    });

    if (!vaga) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Omitir a senha de cada empresa
    const { senha, ...empresaSemSenha } = vaga.empresa;

    res.status(200).json({
      id: vaga.id,
      nome: vaga.nome,
      empresa: empresaSemSenha, // Inclui os dados da empresa sem a senha
    });
  } catch (err) {
    console.error('Erro ao buscar vaga:', err);
    res.status(500).json({ message: 'Erro ao buscar vaga' });
  }
});

module.exports = router;
