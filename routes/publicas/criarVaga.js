import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware para verificar se a empresa existe
const verificarEmpresaExistente = async (req, res, next) => {
  const { empresaId } = req.body;

  if (!empresaId) return next();

  const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
  if (!empresa) {
    return res.status(404).json({ error: 'Empresa não encontrada.' });
  }

  next();
};

// Criar vaga
router.post('/vagas', verificarEmpresaExistente, async (req, res) => {
  const { titulo, descricao, localizacao, salario, empresaId } = req.body;

  // Verifica se todos os campos necessários foram fornecidos
  if (!titulo || !descricao || !localizacao || !empresaId) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const vaga = await prisma.vaga.create({
      data: {
        titulo,
        descricao,
        localizacao,
        salario,
        empresaId
      }
    });
    res.status(201).json(vaga);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Editar vaga
router.put('/vagas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, localizacao, salario } = req.body;

  // Verifica se a vaga existe
  const vagaExistente = await prisma.vaga.findUnique({ where: { id } });
  if (!vagaExistente) {
    return res.status(404).json({ error: 'Vaga não encontrada.' });
  }

  try {
    const vaga = await prisma.vaga.update({
      where: { id },
      data: {
        titulo,
        descricao,
        localizacao,
        salario
      }
    });
    res.json(vaga);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar vaga
router.delete('/vagas/:id', async (req, res) => {
  const { id } = req.params;

  // Verifica se a vaga existe
  const vagaExistente = await prisma.vaga.findUnique({ where: { id } });
  if (!vagaExistente) {
    return res.status(404).json({ error: 'Vaga não encontrada.' });
  }

  try {
    await prisma.vaga.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
