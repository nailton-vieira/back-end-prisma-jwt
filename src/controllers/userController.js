
const prisma = require('../models/prisma/client');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        criadodt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        criadodt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario não encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, funcao } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { nome, email, funcao },
      select: {
        id: true,
        nome: true,
        email: true,
        funcao: true,
        criadodt: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Usuario deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };