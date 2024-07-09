import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';

export default function Todo() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');
    const [editTask, setEditTask] = useState('');
    const [editId, setEditId] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:3000/todos');
        setTodos(response.data);
    };

    const addTodo = async () => {
        const response = await axios.post('http://localhost:3000/todos', { task });
        setTodos([...todos, response.data]);
        setTask('');
    };

    const updateTodo = async (id) => {
        const response = await axios.put(`http://localhost:3000/todos/${id}`, { task: editTask });
        setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
        handleClose();
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:3000/todos/${id}`);
        setTodos(todos.filter(todo => todo._id !== id));
    };

    const handleShow = (todo) => {
        setEditTask(todo.task);
        setEditId(todo._id);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setEditTask('');
        setEditId(null);
    };

    return (
        <div className="container">
            <h1 className="my-4">Todo App</h1>
            <Form className="mb-4">
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Enter task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={addTodo} className="mt-2">Add</Button>
            </Form>
            <ListGroup>
                {todos.map(todo => (
                    <ListGroup.Item key={todo._id} className="d-flex justify-content-between align-items-center">
                        {todo.task}
                        <div>
                            <Button variant="warning" className="me-2" onClick={() => handleShow(todo)}>Edit</Button>
                            <Button variant="danger" onClick={() => deleteTodo(todo._id)}>Delete</Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={() => updateTodo(editId)}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
