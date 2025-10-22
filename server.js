const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database initialization
const db = new sqlite3.Database('todoist.db');

// Create tables
db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Projects table
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            color TEXT DEFAULT 'blue',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Tasks table
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            project_id INTEGER,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            date TEXT,
            priority TEXT DEFAULT 'normal',
            location TEXT,
            notes TEXT,
            timer_mode TEXT DEFAULT 'stopwatch',
            timer_time INTEGER DEFAULT 0,
            timer_target INTEGER DEFAULT 300,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    `);

    // Subtasks table
    db.run(`
        CREATE TABLE IF NOT EXISTS subtasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
        )
    `);

    // Comments table
    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            author TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
        )
    `);

    // Labels table
    db.run(`
        CREATE TABLE IF NOT EXISTS labels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            color TEXT DEFAULT 'blue',
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Task labels junction table
    db.run(`
        CREATE TABLE IF NOT EXISTS task_labels (
            task_id INTEGER NOT NULL,
            label_id INTEGER NOT NULL,
            PRIMARY KEY (task_id, label_id),
            FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
            FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE
        )
    `);

    // Reminders table
    db.run(`
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            reminder_date DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
        )
    `);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name],
            function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                
                const token = jwt.sign(
                    { userId: this.lastID, email, name },
                    JWT_SECRET,
                    { expiresIn: '30d' }
                );
                
                res.json({ token, user: { id: this.lastID, email, name } });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                
                const token = jwt.sign(
                    { userId: user.id, email: user.email, name: user.name },
                    JWT_SECRET,
                    { expiresIn: '30d' }
                );
                
                res.json({ 
                    token, 
                    user: { id: user.id, email: user.email, name: user.name } 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Projects routes
app.get('/api/projects', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at',
        [req.user.userId],
        (err, projects) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(projects);
        }
    );
});

app.post('/api/projects', authenticateToken, (req, res) => {
    const { name, color = 'blue' } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }
    
    db.run(
        'INSERT INTO projects (user_id, name, color) VALUES (?, ?, ?)',
        [req.user.userId, name, color],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            db.get(
                'SELECT * FROM projects WHERE id = ?',
                [this.lastID],
                (err, project) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    res.json(project);
                }
            );
        }
    );
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
    const { name, color } = req.body;
    
    db.run(
        'UPDATE projects SET name = ?, color = ? WHERE id = ? AND user_id = ?',
        [name, color, req.params.id, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
            res.json({ message: 'Project updated successfully' });
        }
    );
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
    db.run(
        'DELETE FROM projects WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
            res.json({ message: 'Project deleted successfully' });
        }
    );
});

// Tasks routes
app.get('/api/tasks', authenticateToken, (req, res) => {
    const query = `
        SELECT t.*, 
               GROUP_CONCAT(DISTINCT s.id || '|' || s.text || '|' || s.completed) as subtasks,
               GROUP_CONCAT(DISTINCT c.id || '|' || c.text || '|' || c.author || '|' || c.created_at) as comments,
               GROUP_CONCAT(DISTINCT l.name) as labels,
               GROUP_CONCAT(DISTINCT r.reminder_date) as reminders
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
        LEFT JOIN comments c ON t.id = c.task_id
        LEFT JOIN task_labels tl ON t.id = tl.task_id
        LEFT JOIN labels l ON tl.label_id = l.id
        LEFT JOIN reminders r ON t.id = r.task_id
        WHERE t.user_id = ?
        GROUP BY t.id
        ORDER BY t.created_at DESC
    `;
    
    db.all(query, [req.user.userId], (err, tasks) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        // Parse the concatenated data
        const parsedTasks = tasks.map(task => ({
            ...task,
            subtasks: task.subtasks ? task.subtasks.split(',').map(s => {
                const [id, text, completed] = s.split('|');
                return { id: parseInt(id), text, completed: completed === '1' };
            }) : [],
            comments: task.comments ? task.comments.split(',').map(c => {
                const [id, text, author, created_at] = c.split('|');
                return { id: parseInt(id), text, author, timestamp: created_at };
            }) : [],
            labels: task.labels ? task.labels.split(',').filter(l => l) : [],
            reminders: task.reminders ? task.reminders.split(',').filter(r => r) : []
        }));
        
        res.json(parsedTasks);
    });
});

app.post('/api/tasks', authenticateToken, (req, res) => {
    const { 
        text, 
        project_id, 
        date = new Date().toISOString().split('T')[0], 
        priority = 'normal',
        location = '',
        notes = ''
    } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Task text is required' });
    }
    
    db.run(
        `INSERT INTO tasks (user_id, project_id, text, date, priority, location, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.userId, project_id, text, date, priority, location, notes],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            db.get(
                'SELECT * FROM tasks WHERE id = ?',
                [this.lastID],
                (err, task) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    res.json({
                        ...task,
                        subtasks: [],
                        comments: [],
                        labels: [],
                        reminders: []
                    });
                }
            );
        }
    );
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    const updates = req.body;
    const allowedFields = ['text', 'completed', 'date', 'priority', 'location', 'notes', 'timer_mode', 'timer_time', 'timer_target'];
    
    const updateFields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
            updateFields.push(`${key} = ?`);
            values.push(updates[key]);
        }
    });
    
    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    values.push(req.params.id, req.user.userId);
    
    db.run(
        `UPDATE tasks SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND user_id = ?`,
        values,
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
            res.json({ message: 'Task updated successfully' });
        }
    );
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    db.run(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
            res.json({ message: 'Task deleted successfully' });
        }
    );
});

// Subtasks routes
app.post('/api/tasks/:taskId/subtasks', authenticateToken, (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Subtask text is required' });
    }
    
    // First verify the task belongs to the user
    db.get(
        'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
        [req.params.taskId, req.user.userId],
        (err, task) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!task) return res.status(404).json({ error: 'Task not found' });
            
            db.run(
                'INSERT INTO subtasks (task_id, text) VALUES (?, ?)',
                [req.params.taskId, text],
                function(err) {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    
                    db.get(
                        'SELECT * FROM subtasks WHERE id = ?',
                        [this.lastID],
                        (err, subtask) => {
                            if (err) return res.status(500).json({ error: 'Database error' });
                            res.json(subtask);
                        }
                    );
                }
            );
        }
    );
});

app.put('/api/subtasks/:id', authenticateToken, (req, res) => {
    const { completed } = req.body;
    
    db.run(
        `UPDATE subtasks SET completed = ? 
         WHERE id = ? AND task_id IN (SELECT id FROM tasks WHERE user_id = ?)`,
        [completed, req.params.id, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'Subtask not found' });
            res.json({ message: 'Subtask updated successfully' });
        }
    );
});

app.delete('/api/subtasks/:id', authenticateToken, (req, res) => {
    db.run(
        `DELETE FROM subtasks 
         WHERE id = ? AND task_id IN (SELECT id FROM tasks WHERE user_id = ?)`,
        [req.params.id, req.user.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'Subtask not found' });
            res.json({ message: 'Subtask deleted successfully' });
        }
    );
});

// Comments routes
app.post('/api/tasks/:taskId/comments', authenticateToken, (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Comment text is required' });
    }
    
    // Verify task belongs to user
    db.get(
        'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
        [req.params.taskId, req.user.userId],
        (err, task) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!task) return res.status(404).json({ error: 'Task not found' });
            
            db.run(
                'INSERT INTO comments (task_id, text, author) VALUES (?, ?, ?)',
                [req.params.taskId, text, req.user.name],
                function(err) {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    
                    db.get(
                        'SELECT * FROM comments WHERE id = ?',
                        [this.lastID],
                        (err, comment) => {
                            if (err) return res.status(500).json({ error: 'Database error' });
                            res.json({
                                ...comment,
                                timestamp: comment.created_at
                            });
                        }
                    );
                }
            );
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;