const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
const connectDB = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

//GET lấy tát cả todos
app.get("/todos", async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch todos" });
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
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

//DELETE xóa 1 todo
app.delete("/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server chạy tại http://localhost:${PORT}`)
);


