const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '..','frontend', 'build')));

mongoose.connect('mongodb+srv://hanashelbin:T7Izt7PNSKyor4OL@cluster0.m2eupyp.mongodb.net/tutorial?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(err));

const Todo = mongoose.model('Todo', new mongoose.Schema({
    task: { type: String, required: true }
}));

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.send(todos);
});

app.post('/todos', async (req, res) => {
    const todo = new Todo({
        task: req.body.task
    });
    await todo.save();
    res.send(todo);
});

app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(todo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.send({ message: 'Todo deleted' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


