import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para listar o usuário específico
router.get('/usuario', async (req, res) => {
  console.log('User ID:', req.userId); // Verifique se o userId está sendo passado corretamente

  const { userId } = req;

  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário não encontrado' });
  }

  try {
    // Buscar o usuário no banco de dados, incluindo experiências e educação
    const usuario = await prisma.candidato.findUnique({
      where: { id: userId },
      include: {
        experiencia: true, // Inclui as experiências
        educacao: true,    // Inclui a educação
      }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Omitir a senha da resposta
    const { senha, ...usuarioSemSenha } = usuario;

    res.status(200).json({ message: 'Usuário encontrado com sucesso', usuario: usuarioSemSenha });
  } catch (err) {
    console.error('Erro ao listar usuário:', err);
    res.status(500).json({ message: 'Erro ao listar usuário' });
  }
});

export default router;
