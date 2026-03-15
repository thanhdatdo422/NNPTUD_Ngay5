const Product = require('../schemas/products');
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ 
            success: true, 
            data: savedProduct 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ 
            success: true, 
            data: products 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy sản phẩm" 
            });
        }
        res.status(200).json({ 
            success: true, 
            data: product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, 
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy sản phẩm để cập nhật" 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: updatedProduct 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy sản phẩm để xóa" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Xóa sản phẩm thành công" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};