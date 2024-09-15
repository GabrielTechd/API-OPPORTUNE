import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Rotas e middlewares
import CadastroUsuarios from "./routes/publicas/criarCandidado.js";
import CadastroEmpresa from "./routes/publicas/criarEmpresa.js";
import CriarVagas from "./routes/publicas/criarVaga.js";
import listarVagas from "./routes/publicas/listarVaga.js";
import increverVagas from "./routes/publicas/inscreverse.js";
import LoginUsuarios from "./routes/publicas/login.js";
import ListarUsuarios from "./routes/privadas/listarUsuarios.js";
import DeletarUsuarios from "./routes/privadas/deletarUsuarios.js";
import EditarUsuarios from "./routes/privadas/editarUsuarios.js";
import usuarioUnico from "./routes/privadas/usuario.js";
import Aplicar from "./routes/privadas/aplicacao.js";
import auth from "./middlewares/auth.js";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const server = http.createServer(app);

// Obter variáveis de ambiente
const PORT = process.env.PORT || 3003;
const FRONTEND_URLS = (process.env.FRONTEND_URLS || '').split(',');

// Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URLS,
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

// Middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || FRONTEND_URLS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

// Rota para criar vagas e emitir evento para os clientes conectados
app.post("/criar-vaga", async (req, res) => {
  // Lógica para criar a vaga
  const novaVaga = { /* Dados da vaga */ };

  // Emite um evento via WebSocket para todos os clientes conectados
  io.emit("novaVaga", novaVaga);

  res.status(201).send({ vaga: novaVaga });
});

// Rotas públicas
app.use("/", CadastroUsuarios);
app.use("/", CadastroEmpresa);
app.use("/", LoginUsuarios);
app.use("/", CriarVagas);
app.use("/", listarVagas);
app.use("/", increverVagas);

// Rotas privadas
app.use("/", auth, ListarUsuarios);
app.use("/", auth, usuarioUnico);
app.use("/", auth, DeletarUsuarios);
app.use("/", auth, EditarUsuarios);
app.use("/", auth, Aplicar);

// Inicializar o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
