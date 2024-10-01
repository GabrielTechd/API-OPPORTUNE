@@ -0,0 +1,55 @@
// Importando os módulos necessários
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import Cadastro from './rotas/publicas/cadastro.js';
import Login from './rotas/publicas/login.js';
import Contato from './rotas/publicas/contato.js'; // Certifique-se que esta exportação é padrão
import ListaMensagens from './rotas/publicas/listaMensagens.js'; // Importe a nova rota
import Posts from './rotas/publicas/posts.js'; // Importe a nova rota
import Photos from './rotas/publicas/photo.js'; // Importe a nova rota

import Usuarios from './rotas/privadas/usuarios.js'; // Rotas de usuários
import UsuariosLogado from './rotas/privadas/usuarioLogado.js';
import auth from './middleware/auth.js';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.use(express.json());

// Configurar CORS para permitir múltiplos domínios
const allowedOrigins = process.env.FRONTEND_URL.split(','); // Divide as URLs por vírgula

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Permitir a origem
    } else {
      callback(new Error("Origin not allowed by CORS")); // Rejeitar a origem
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permitir cookies e autorizações
};

// Usar CORS com as opções configuradas
app.use(cors(corsOptions));

// Rotas públicas
app.use('/', Cadastro);
app.use('/', Login);
app.use('/', Contato); // A rota para contatos deve ser verificada aqui
app.use('/', ListaMensagens); // Adicione a nova rota para listar mensagens
app.use('/', Posts); // Adicione a nova rota para listar mensagens
app.use('/', Photos); // Adicione a nova rota para listar mensagens

// Rotas privadas
app.use('/', auth, Usuarios); // Adiciona as rotas de usuários protegidas
app.use('/', auth, UsuariosLogado); // Rota para usuário logado

// Iniciar o servidor
const PORT = process.env.PORT || 3000; // Permitir configuração de porta pelo ambiente
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT} 👌`));