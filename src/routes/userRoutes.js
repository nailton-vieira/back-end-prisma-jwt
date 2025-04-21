const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/', authMiddleware('admin'), userController.getAllUsers);
router.get('/:id', authMiddleware('admin'), userController.getUserById);
router.put('/:id', authMiddleware('admin'), userController.updateUser);
router.delete('/:id', authMiddleware('admin'), userController.deleteUser);

module.exports = router;