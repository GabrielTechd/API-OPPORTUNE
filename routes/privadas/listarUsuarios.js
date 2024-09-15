import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/listar", async (req, res) => {
  try {
    const candidatos = await prisma.candidato.findMany(); // Listar candidatos
    const empresas = await prisma.empresa.findMany();   // Listar empresas

    // Omitir o campo senha dos candidatos
    const candidatosSemSenha = candidatos.map(candidato => {
      const { senha, ...candidatoSemSenha } = candidato;
      return candidatoSemSenha;
    });

    // Omitir o campo senha das empresas
    const empresasSemSenha = empresas.map(empresa => {
      const { senha, ...empresaSemSenha } = empresa;
      return empresaSemSenha;
    });

    res.status(200).json({
      message: 'Todos os usuários, empresas e candidatos listados com sucesso',
      candidatos: candidatosSemSenha,
      empresas: empresasSemSenha
    });
  } catch (err) {
    console.error("Erro ao listar todos os usuários, empresas e candidatos:", err);
    res.status(500).json({ message: "Erro ao listar todos os usuários, empresas e candidatos" });
  }
});

export default router;
