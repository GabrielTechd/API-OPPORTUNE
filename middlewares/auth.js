import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  // Verifica se o token está presente no cabeçalho
  const authHeader = req.headers.authorization;

  // Verifica se o token foi fornecido
  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso Negado' });
  }

  // Remove o prefixo "Bearer " do token
  const token = authHeader.replace('Bearer ', '');

  try {
    // Decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adiciona o ID do usuário à requisição
    req.userId = decoded.id;

    // Prossegue para o próximo middleware
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default auth;