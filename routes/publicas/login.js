import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// Use a chave secreta da variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido no ambiente");
}

// Validação e sanitização de entrada
const validateLogin = [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

router.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, senha } = req.body;

  try {
    // Encontre o usuário em ambas as tabelas
    let user = await prisma.candidato.findUnique({ where: { email } });
    let userType = 'candidato'; // Define o tipo padrão como 'candidato'

    if (!user) {
      user = await prisma.empresa.findUnique({ where: { email } });
      userType = 'empresa'; // Se encontrado na tabela 'empresa', define o tipo como 'empresa'
    }

    // Se o usuário não for encontrado ou a senha não corresponder
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
