const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');
const User = require('../schemas/users'); // Import User để truy vấn users theo role

// --- CRUD ROLE ---

// CREATE
router.post('/', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        const savedRole = await newRole.save();
        res.status(201).json({ success: true, data: savedRole });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// READ ALL (Chỉ lấy các Role chưa bị xóa mềm)
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ success: false, message: "Không tìm thấy Role" });
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, 
            req.body, 
            { new: true }
        );
        if (!updatedRole) return res.status(404).json({ success: false, message: "Không tìm thấy Role" });
        res.status(200).json({ success: true, data: updatedRole });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE (Xóa mềm - Chuyển isDeleted thành true)
router.delete('/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!deletedRole) return res.status(404).json({ success: false, message: "Không tìm thấy Role" });
        res.status(200).json({ success: true, message: "Đã xóa mềm Role thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- YÊU CẦU 4: Lấy tất cả user theo Role ID ---
// GET /roles/:id/users
router.get('/:id/users', async (req, res) => {
    try {
        // Kiểm tra xem role có tồn tại không
        const roleExists = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!roleExists) return res.status(404).json({ success: false, message: "Role không tồn tại" });

        // Tìm tất cả users có role này và chưa bị xóa
        const users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;