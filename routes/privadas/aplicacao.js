import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para listar candidatos inscritos em uma vaga específica da empresa
router.get('/empresa/:empresaId/vagas/:vagaId/candidatos', async (req, res) => {
  const { empresaId, vagaId } = req.params;

  try {
    // Verifica se a vaga pertence à empresa
    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: { empresa: true },
    });

    if (!vaga) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    if (vaga.empresa.id !== empresaId) {
      return res.status(403).json({ message: 'Você não tem permissão para ver esta vaga' });
    }

    // Lista todos os candidatos inscritos na vaga
    const inscricoes = await prisma.inscricao.findMany({
      where: { vagaId },
      include: {
        candidato: true, // Inclui informações do candidato
      },
    });

    res.status(200).json({ message: 'Candidatos listados com sucesso', inscritos: inscricoes });
  } catch (err) {
    console.error('Erro ao listar candidatos:', err);
    res.status(500).json({ message: 'Erro ao listar candidatos' });
  }
});


export default router;
