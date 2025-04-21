const prisma = require('../models/prisma/client');

const getAllProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const getProdutoById = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!produto) {
      return res.status(404).json({ message: 'Produto não Encontrado' });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const createProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        userId: req.userData.userId,
      },
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const updateProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;

    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (produto.userId !== req.userData.userId && req.userData.funcao !== 'admin') {
      return res.status(403).json({ message: 'Não autorizado para atualizar o recurso' });
    }

    const updatedProduto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: { nome, descricao, preco: parseFloat(preco), quantidade: parseInt(quantidade) },
    });

    res.json(updatedProduto);
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

const deleteProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (produto.userId !== req.userData.userId && req.userData.funcao !== 'admin') {
      return res.status(403).json({ message: 'Não autorizado para deletar o produto' });
    }

    await prisma.produto.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Algo deu errado' });
  }
};

module.exports = {
  getAllProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
};