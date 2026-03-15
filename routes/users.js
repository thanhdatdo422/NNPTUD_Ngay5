const express = require('express');
const router = express.Router();
const User = require('../schemas/users');

// --- CRUD USER ---

// CREATE
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({ success: true, data: savedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// READ ALL (Lấy tất cả, populate thông tin role, chỉ lấy user chưa bị xóa mềm)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy User" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, 
            req.body, 
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ success: false, message: "Không tìm thấy User" });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE (Xóa mềm - Chuyển isDeleted thành true)
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!deletedUser) return res.status(404).json({ success: false, message: "Không tìm thấy User" });
        res.status(200).json({ success: true, message: "Đã xóa mềm User thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- YÊU CẦU 2: ENABLE USER ---
// POST /users/enable
router.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true } // Trả về thông tin sau khi update
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "Sai thông tin email hoặc username" });
        }
        res.status(200).json({ success: true, message: "Đã kích hoạt tài khoản", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- YÊU CẦU 3: DISABLE USER ---
// POST /users/disable
router.post('/disable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "Sai thông tin email hoặc username" });
        }
        res.status(200).json({ success: true, message: "Đã vô hiệu hóa tài khoản", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;