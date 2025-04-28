import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5277/api/Tasks';
const API_URL_WITH_ID = 'http://localhost:5277/api/Tasks/';

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTask, setNewTask] = useState({
        publicTaskID: generateTaskId(),
        title: '',
        description: '',
        dueDateTime: ''
    });
    const [searchId, setSearchId] = useState('');

    // Generate a custom task ID in the format "task-XXXX-XXXX"
    function generateTaskId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let firstPart = '';
        let secondPart = '';

        for (let i = 0; i < 4; i++) {
            firstPart += chars.charAt(Math.floor(Math.random() * chars.length));
            secondPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return `task-${firstPart}-${secondPart}`;
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchTask = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL_WITH_ID}${searchId}`);
            if (response.status === 404) {
                alert('Task not found.');
                return;
            }
            if (!response.ok) throw new Error('Failed to search task');
            const task = await response.json();
            setTasks([task]); // Set a single result as array
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchId('');
        fetchTasks();
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();

        try {
            const fetchResponse = await fetch(API_URL);
            if (!fetchResponse.ok) throw new Error('Failed to fetch existing tasks');
            const existingTasks = await fetchResponse.json();

            const idExists = existingTasks.some(task => task.publicTaskID === newTask.publicTaskID);

            if (idExists) {
                alert('A task with this Public Task ID already exists. Please refresh or try again.');
                return;
            }

            const postResponse = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (!postResponse.ok) throw new Error('Failed to create task');

            setNewTask({
                publicTaskID: generateTaskId(),
                title: '',
                description: '',
                dueDateTime: ''
            });

            fetchTasks();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const response = await fetch(`${API_URL_WITH_ID}${taskId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete task');
            fetchTasks();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateTask = async (task) => {
        const newTitle = prompt('Enter new title:', task.title);
        if (newTitle === null || newTitle.trim() === '') return;

        try {
            const response = await fetch(`${API_URL_WITH_ID}${task.publicTaskID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, title: newTitle })
            });
            if (!response.ok) throw new Error('Failed to update task');
            fetchTasks();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Task Manager</h1>

            {/* Display Generated Task ID */}
            <div style={{ marginBottom: '20px' }}>
                <p><strong>New Task ID:</strong> {newTask.publicTaskID}</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchTask} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by Public Task ID"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    style={{ padding: '8px', width: '250px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 15px' }}>Search</button>
                <button type="button" onClick={handleClearSearch} style={{ padding: '8px 15px', marginLeft: '10px' }}>
                    Clear
                </button>
            </form>

            {/* Create New Task */}
            <form onSubmit={handleCreateTask} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '300px' }}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '300px' }}
                />
                <input
                    type="datetime-local"
                    value={newTask.dueDateTime}
                    onChange={e => setNewTask({ ...newTask, dueDateTime: e.target.value })}
                    required
                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '300px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Create Task</button>
            </form>

            {/* Task List */}
            {loading ? (
                <p>Loading tasks...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {tasks.length === 0 ? (
                        <p>No tasks found.</p>
                    ) : (
                        tasks.map(task => (
                            <li key={task.publicTaskID} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
                                <strong>{task.title}</strong><br />
                                <small>ID: {task.publicTaskID}</small><br />
                                <small>{task.description}</small><br />
                                <small>Due: {new Date(task.dueDateTime).toLocaleString()}</small><br />
                                <button onClick={() => handleUpdateTask(task)} style={{ marginRight: '10px' }}>Update</button>
                                <button onClick={() => handleDeleteTask(task.publicTaskID)}>Delete</button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default App;