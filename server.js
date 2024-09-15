import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:3000", "https://opportune-sigma.vercel.app/"]; // Adicione todas as origens permitidas aqui

const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Permitir múltiplas origens
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

// CORS middleware com múltiplas origens
app.use(cors({
  origin: function (origin, callback) {
    // Verificar se a origem solicitante está na lista de origens permitidas
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

// Rotas e lógica

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
