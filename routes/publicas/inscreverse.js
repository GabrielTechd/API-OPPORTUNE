import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Rota para inscrever um candidato em uma vaga
router.post("/inscrever", async (req, res) => {
  const { candidatoId, vagaId } = req.body;

  if (!candidatoId || !vagaId) {
    return res.status(400).json({ message: "ID do candidato e ID da vaga são obrigatórios" });
  }

  try {
    // Verificar se a vaga e o candidato existem
    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    const candidato = await prisma.candidato.findUnique({ where: { id: candidatoId } });

    if (!vaga || !candidato) {
      return res.status(404).json({ message: "Vaga ou candidato não encontrado" });
    }

    // Criar a inscrição
    const inscricao = await prisma.inscricao.create({
      data: {
        candidatoId,
        vagaId
      }
    });

    // Opcional: Notificar a empresa sobre a nova inscrição
    // Aqui você pode implementar uma lógica para enviar um e-mail ou outra notificação para a empresa

    res.status(201).json({ message: "Inscrição realizada com sucesso", inscricao });
  } catch (err) {
    console.error("Erro ao inscrever candidato:", err);
    res.status(500).json({ message: "Erro ao inscrever candidato" });
  }
});

export default router;
