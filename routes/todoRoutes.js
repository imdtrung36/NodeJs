const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const mongoose = require("mongoose");

router.put("/:id", async (req, res) => {
    try {
        const { text, completed } = req.body;
        const updatedFields = {}
        if (text !== undefined) updatedFields.text = text;
        if (completed !== undefined) updatedFields.completed = completed;

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo không tồn tại" });
        }
        
        res.json(updatedTodo);

    } catch (err) {
        console.error("Lỗi khi cập nhật todo:", err);
        res.status(500).json({ error: "Lỗi sau khi cập nhập Todo" })
    }
});

// DELETE nhiều todos đã chọn
router.delete("/selected", async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Danh sách ID không hợp lệ" });
        }

        // Kiểm tra xem tất cả IDs có hợp lệ không
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
        
        if (validIds.length !== ids.length) {
            return res.status(400).json({ error: "Một số ID không hợp lệ" });
        }

        const result = await Todo.deleteMany({ _id: { $in: validIds } });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Không tìm thấy todos để xóa" });
        }

        res.json({ 
            success: true, 
            message: `Đã xóa ${result.deletedCount} todos`,
            deletedCount: result.deletedCount 
        });

    } catch (err) {
        console.error("Lỗi khi xóa nhiều todos:", err);
        res.status(500).json({ error: "Lỗi khi xóa todos đã chọn" });
    }
});

// DELETE xóa tất cả todos đã hoàn thành
router.delete("/completed", async (req, res) => {
    try {
        const result = await Todo.deleteMany({ completed: true });
        
        res.json({ 
            success: true, 
            message: `Đã xóa ${result.deletedCount} todos đã hoàn thành`,
            deletedCount: result.deletedCount 
        });

    } catch (err) {
        console.error("Lỗi khi xóa todos đã hoàn thành:", err);
        res.status(500).json({ error: "Lỗi khi xóa todos đã hoàn thành" });
    }
});

module.exports = router;