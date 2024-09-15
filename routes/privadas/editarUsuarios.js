import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.put("/editar", async (req, res) => {
  try {
    // Verifique se o usuário está autenticado e obtenha o userId
    const userId = req.userId; // Supondo que o middleware `auth` adiciona o `userId` ao req

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { nome, email, telefone, biografia, site, tipo, curriculo, fotoPerfil, habilidades, dataCadastro, experiencia, educacao, status } = req.body;

    // Verifique se pelo menos um campo foi fornecido para atualização
    if (!nome && !email && !telefone && !biografia && !site && !tipo && !curriculo && !fotoPerfil && !habilidades && !dataCadastro && !experiencia && !educacao && !status) {
      return res.status(400).json({ message: "Nenhum dado para atualizar" });
    }

    // Atualize o usuário no banco de dados
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome,
        email,
        telefone,
        biografia,
        site,
        tipo,
        curriculo,
        fotoPerfil,
        habilidades,
        dataCadastro: dataCadastro ? new Date(dataCadastro) : undefined,
        experiencia: experiencia ? {
          deleteMany: { usuarioId: userId },
          create: experiencia.map((exp) => ({
            cargo: exp.cargo,
            empresa: exp.empresa,
            inicio: new Date(exp.inicio),
            fim: new Date(exp.fim),
          })),
        } : undefined,
        educacao: educacao ? {
          deleteMany: { usuarioId: userId },
          create: educacao.map((edu) => ({
            instituicao: edu.instituicao,
            curso: edu.curso,
            inicio: new Date(edu.inicio),
            fim: new Date(edu.fim),
          })),
        } : undefined,
        status
      },
    });

    res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

export default router;
