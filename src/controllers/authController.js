
const bcrypt = require('bcryptjs');
const prisma = require('../models/prisma/client');
const { generateToken } = require('../utils/jwtUtils');

const register = async (req, res) => {
  try {
    const { nome, email, senha, funcao = 'user' } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'O usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        funcao,
      },
    });

    const token = generateToken(user.id, user.funcao);
    res.status(201).json({ user: { id: user.id, nome: user.nome, email: user.email, funcao: user.funcao }, token });
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(400).json({ message: 'Credencial invalida' });
    }

    const token = generateToken(user.id, user.funcao);
    res.json({ user: { id: user.id, nome: user.nome, email: user.email, funcao: user.funcao }, token });
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

module.exports = { register, login };