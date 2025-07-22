router.put("/:id", async (req, res) => {
    try {
        const { text, completed } = req.body;
        const updatedFields = {}
        if (text !== undefined) updatedFields.text = text;
        if (completed !== undefined) updatedFields.completed = completed;

        const updatedTodo = await Todo.findByIdUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        res.json(updatedTodo);

    } catch (err) {
        res.status(500).json({ error: "Lỗi sau khi cập nhập Todo" })
    }
});