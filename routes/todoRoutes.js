const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const mongoose = require("mongoose");

// DELETE nhiều todos đã chọn - phải đặt trước /:id
router.delete("/selected", async (req, res) => {
    try {
        console.log("Received delete selected request:", req.body);
        const { ids } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Danh sách ID không hợp lệ" });
        }

        console.log("IDs to delete:", ids);

        // Kiểm tra xem tất cả IDs có hợp lệ không
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
        
        if (validIds.length !== ids.length) {
            return res.status(400).json({ error: "Một số ID không hợp lệ" });
        }

        console.log("Valid IDs:", validIds);

        const result = await Todo.deleteMany({ _id: { $in: validIds } });
        
        console.log("Delete result:", result);

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

// DELETE xóa tất cả todos đã hoàn thành - phải đặt trước /:id
router.delete("/completed", async (req, res) => {
    try {
        console.log("Received delete completed request");
        const result = await Todo.deleteMany({ completed: true });
        
        console.log("Delete completed result:", result);
        
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

// PUT cập nhật todo - đặt sau các routes cụ thể
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

// DELETE xóa một todo - đặt sau các routes cụ thể
router.delete("/:id", async (req, res) => {
    try {
        console.log("Received delete single todo request for ID:", req.params.id);
        const deleted = await Todo.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ error: "Todo không tồn tại" });
        }
        
        console.log("Deleted todo:", deleted);
        res.json({ success: true, message: "Đã xóa todo thành công" });
    } catch (err) {
        console.error("Lỗi khi xóa todo:", err);
        res.status(500).json({ error: "Lỗi khi xóa todo" });
    }
});

module.exports = router;