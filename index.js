const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
const connectDB = require("./db");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Sử dụng routes
app.use("/todos", todoRoutes);

//GET lấy tát cả todos
app.get("/todos", async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  });

//GET lấy todos theo trạng thái
app.get("/todos/status/:completed", async (req, res) => {
    try {
        const completed = req.params.completed === 'true';
        const todos = await Todo.find({ completed: completed });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch todos by status" });
    }
});

//POST tạo mới todo
app.post("/todos", async (req, res) => {
    try {
      const newTodo = new Todo({ text: req.body.text });
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (err) {
      res.status(500).json({ error: "Failed to save todo" });
    }
  });

//PUT cập nhập trạng thái todo
app.put("/todos/:id", async (req, res) => {
    try {
        const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ error: "Todo không tồn tại" });
        }
        res.json(updated);
    } catch (err) {
        console.error("Lỗi khi cập nhật todo:", err);
        res.status(500).json({ error: "Lỗi khi cập nhật todo" });
    }
});

//DELETE xóa 1 todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const deleted = await Todo.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Todo không tồn tại" });
        }
        res.json({ success: true, message: "Đã xóa todo thành công" });
    } catch (err) {
        console.error("Lỗi khi xóa todo:", err);
        res.status(500).json({ error: "Lỗi khi xóa todo" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server chạy tại http://localhost:${PORT}`)
);


