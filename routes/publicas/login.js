import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// Use a chave secreta da variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET;

// Rota de Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Verifique se o e-mail e a senha foram fornecidos
  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  }

  try {
    // Encontre o usuário em ambas as tabelas
    let user = await prisma.candidato.findUnique({ where: { email } });
    let userType = 'candidato'; // Define o tipo padrão como 'candidato'

    if (!user) {
      user = await prisma.empresa.findUnique({ where: { email } });
      userType = 'empresa'; // Se encontrado na tabela 'empresa', define o tipo como 'empresa'
    }

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(400).json({ message: "E-mail ou senha inválidos" });
    }

    // Gere o token JWT com o ID do usuário e o tipo no payload
    const token = jwt.sign({ id: user.id, tipo: userType }, JWT_SECRET, { expiresIn: "10d" });

    // Responda com o token JWT e dados do usuário
    res.status(200).json({ token, userType });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ message: "Erro no servidor, tente novamente" });
  }
});

export default router;