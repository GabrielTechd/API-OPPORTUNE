// routes/candidato.js
import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Verifique se o Prisma Client está corretamente inicializado
const router = express.Router();

router.post('/candidato', async (req, res) => {
  try {
    const candidato = req.body;

    if (!candidato.senha || !candidato.email) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    const existingCandidato = await prisma.candidato.findUnique({
      where: { email: candidato.email },
    });

    if (existingCandidato) {
      return res.status(400).json({ message: 'E-mail já está em uso' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(candidato.senha, salt);

    const candidatoDB = await prisma.candidato.create({
      data: {
        email: candidato.email,
        nome: candidato.nome || '',
        senha: hashedSenha,
        telefone: candidato.telefone || '',
        biografia: candidato.biografia || '',
        site: candidato.site || '',
        curriculo: candidato.curriculo || '',
        fotoPerfil: candidato.fotoPerfil || '',
        habilidades: candidato.habilidades || [],
        dataCadastro: candidato.dataCadastro ? new Date(candidato.dataCadastro) : new Date(),
        experiencia: {
          create: candidato.experiencia?.map((exp) => ({
            cargo: exp.cargo,
            empresa: exp.empresa,
            inicio: new Date(exp.inicio),
            fim: new Date(exp.fim),
          })) || [],
        },
        educacao: {
          create: candidato.educacao?.map((edu) => ({
            instituicao: edu.instituicao,
            curso: edu.curso,
            inicio: new Date(edu.inicio),
            fim: new Date(edu.fim),
          })) || [],
        },
        status: candidato.status || 'ativo',
      },
    });

    res.status(201).json(candidatoDB);
  } catch (err) {
    console.error('Erro ao criar candidato:', err);
    res.status(500).json({ message: 'Erro no servidor, tente novamente' });
  }
});

export default router;
