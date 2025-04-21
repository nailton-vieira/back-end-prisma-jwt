
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.getAllProdutos);
router.get('/:id', produtoController.getProdutoById);
router.post('/', authMiddleware(), produtoController.createProduto);
router.put('/:id', authMiddleware(), produtoController.updateProduto);
router.delete('/:id', authMiddleware(), produtoController.deleteProduto);

module.exports = router;