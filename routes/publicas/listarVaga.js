import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/listar-vagas", async (req, res) => {
  try {
    const vagas = await prisma.vaga.findMany({
      include: {
        empresa: true, // Inclui dados da empresa relacionada
      },
    });

    // Omitir a senha de cada empresa
    const vagasSemSenha = vagas.map(vaga => {
      const { senha, ...empresaSemSenha } = vaga.empresa;
      return {
        ...vaga,
        empresa: empresaSemSenha
      };
    });

    res.status(200).json({ message: 'Vagas listadas com sucesso', vagas: vagasSemSenha });
  } catch (err) {
    console.error("Erro ao listar vagas:", err);
    res.status(500).json({ message: "Erro ao listar vagas" });
  }
});

export default router;
