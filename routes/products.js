const express = require('express');
const router = express.Router();

// Nhúng file controller bạn vừa tạo ở Bước 1 vào đây
const productController = require('../controllers/productControllers');

// Gắn các hàm CRUD vào các phương thức HTTP tương ứng
router.post('/', productController.createProduct);        // Tạo sản phẩm mới
router.get('/', productController.getAllProducts);        // Lấy danh sách sản phẩm
router.get('/:id', productController.getProductById);     // Lấy chi tiết 1 sản phẩm
router.put('/:id', productController.updateProduct);      // Cập nhật sản phẩm
router.delete('/:id', productController.deleteProduct);   // Xóa sản phẩm

module.exports = router;