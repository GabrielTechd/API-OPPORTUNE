// routes/empresa.js
import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Verifique se o Prisma Client está corretamente inicializado
const router = express.Router();

router.post('/empresa', async (req, res) => {
  try {
    const empresa = req.body;

    if (!empresa.senha || !empresa.email || !empresa.cnpj) {
      return res.status(400).json({ message: 'E-mail, senha e CNPJ são obrigatórios' });
    }

    const existingEmpresa = await prisma.empresa.findUnique({
      where: { email: empresa.email },
    });

    if (existingEmpresa) {
      return res.status(400).json({ message: 'E-mail já está em uso' });
    }

    const existingCnpj = await prisma.empresa.findUnique({
      where: { cnpj: empresa.cnpj },
    });

    if (existingCnpj) {
      return res.status(400).json({ message: 'CNPJ já está em uso' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(empresa.senha, salt);

    const empresaDB = await prisma.empresa.create({
      data: {
        email: empresa.email,
        nome: empresa.nome || '',
        senha: hashedSenha,
        telefone: empresa.telefone || '',
        biografia: empresa.biografia || '',
        site: empresa.site || '',
        cnpj: empresa.cnpj,
        endereco: empresa.endereco || '',
        dataFundacao: empresa.dataFundacao ? new Date(empresa.dataFundacao) : undefined,
        descricao: empresa.descricao || '',
        dataCadastro: empresa.dataCadastro ? new Date(empresa.dataCadastro) : new Date(),
        status: empresa.status || 'ativo',
      },
    });

    res.status(201).json(empresaDB);
  } catch (err) {
    console.error('Erro ao criar empresa:', err);
    res.status(500).json({ message: 'Erro no servidor, tente novamente' });
  }
});

export default router;
