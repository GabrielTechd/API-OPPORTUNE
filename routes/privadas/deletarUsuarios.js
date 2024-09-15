import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.delete("/deletar", async (req, res) => {
  try {
    // Verifique se o usuário está autenticado e obtenha o userId
    const userId = req.userId; // Supondo que o middleware `auth` adiciona o `userId` ao req

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Primeiro, exclua as experiências relacionadas ao usuário
    await prisma.experiencia.deleteMany({
      where: { usuarioId: userId },
    });

    // Em seguida, exclua as educações relacionadas ao usuário
    await prisma.educacao.deleteMany({
      where: { usuarioId: userId },
    });

    // Agora, exclua o usuário
    await prisma.usuario.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
});

export default router;
