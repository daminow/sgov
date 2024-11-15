const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Validate environment variables
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT', 'SECRET_KEY', 'CORS_ORIGIN'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

app.use(express.json());
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Create users table if it doesn't exist
const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await pool.query(query);
};

createUsersTable().catch(err => console.error('Error creating users table:', err));

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
};

// Login endpoint
app.post('/api/login',
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } catch (err) {
            next(err);
        }
    }
);

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Apply middleware to protected routes
app.use('/api', authenticateToken);

// Работа с голосованиями
app.post('/api/votes', async (req, res) => {
    const { name, nominations } = req.body;
    const id = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const createdAt = new Date();
    const status = false;

    try {
        await pool.query('INSERT INTO votes (id, name, nominations, created_at, status) VALUES ($1, $2, $3, $4, $5)', [id, name, nominations, createdAt, status]);
        res.status(201).json({ id, name, nominations, createdAt, status });
    } catch (err) {
        console.error('Error creating vote:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение всех голосований
app.get('/api/votes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM votes');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching votes:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Удаление голосования
app.delete('/api/votes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM votes WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting vote:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновление голосования
app.patch('/api/votes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, nominations, status } = req.body;
    try {
        await pool.query('UPDATE votes SET name = $1, nominations = $2, status = $3 WHERE id = $4', [name, nominations, status, id]);
        res.json({ message: 'Vote updated successfully' });
    } catch (err) {
        console.error('Error updating vote:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Работа с номинациями
app.post('/api/votes/:voteId/nominations', async (req, res) => {
    const { voteId } = req.params;
    const { name } = req.body;
    const id = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const createdAt = new Date();
    const usersTable = `nominations_${id}`;

    try {
        await pool.query('INSERT INTO nominations (id, name, created_at, users_table) VALUES ($1, $2, $3, $4)', [id, name, createdAt, usersTable]);
        await pool.query(`CREATE TABLE IF NOT EXISTS ${usersTable} (id SERIAL PRIMARY KEY, full_name VARCHAR(255), class VARCHAR(255), photo VARCHAR(255), votes INTEGER DEFAULT 0)`);
        res.status(201).json({ id, name, createdAt, usersTable });
    } catch (err) {
        console.error('Error creating nomination:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение номинаций
app.get('/api/votes/:voteId/nominations', async (req, res) => {
    const { voteId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM nominations WHERE vote_id = $1', [voteId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching nominations:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Удаление номинации
app.delete('/api/votes/:voteId/nominations/:nominationId', async (req, res) => {
    const { nominationId } = req.params;
    try {
        await pool.query('DELETE FROM nominations WHERE id = $1', [nominationId]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting nomination:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Работа с кандидатами
app.post('/api/nominations/:nominationId/candidates', async (req, res) => {
    const { nominationId } = req.params;
    const { fullName, class: className, photo } = req.body;
    const candidateId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const createdAt = new Date();

    try {
        await pool.query(`INSERT INTO nominations_${nominationId} (id, full_name, class, photo, created_at) VALUES ($1, $2, $3, $4, $5)`, [candidateId, fullName, className, photo, createdAt]);
        res.status(201).json({ id: candidateId, fullName, className, photo, createdAt });
    } catch (err) {
        console.error('Error creating candidate:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение кандидатов
app.get('/api/nominations/:nominationId/candidates', async (req, res) => {
    const { nominationId } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM nominations_${nominationId}`);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching candidates:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновление информации о кандидате
app.patch('/api/nominations/:nominationId/candidates/:candidateId', async (req, res) => {
    const { nominationId, candidateId } = req.params;
    const { fullName, class: className, photo } = req.body;
    try {
        await pool.query(`UPDATE nominations_${nominationId} SET full_name = $1, class = $2, photo = $3 WHERE id = $4`, [fullName, className, photo, candidateId]);
        res.json({ message: 'Candidate information updated successfully' });
    } catch (err) {
        console.error('Error updating candidate:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Удаление кандидата
app.delete('/api/nominations/:nominationId/candidates/:candidateId', async (req, res) => {
    const { nominationId, candidateId } = req.params;
    try {
        await pool.query(`DELETE FROM nominations_${nominationId} WHERE id = $1`, [candidateId]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting candidate:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновление голосов кандидата
app.patch('/api/nominations/:nominationId/candidates/:candidateId/vote', async (req, res) => {
    const { nominationId, candidateId } = req.params;
    try {
        await pool.query(`UPDATE nominations_${nominationId} SET votes = votes + 1 WHERE id = $1`, [candidateId]);
        res.json({ message: 'Vote count updated successfully' });
    } catch (err) {
        console.error('Error updating vote count:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Работа с сессиями
app.post('/api/sessions', async (req, res) => {
    const { name, type } = req.body;
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = new Date();
    const devices = 0;

    try {
        await pool.query('INSERT INTO sessions (id, name, createdAt, devices, type, code) VALUES ($1, $2, $3, $4, $5, $6)', [id, name, createdAt, devices, type, code]);
        res.status(201).json({ id, name, createdAt, devices, type, code });
    } catch (err) {
        console.error('Error creating session:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение всех сессий
app.get('/api/sessions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sessions');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sessions:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Удаление сессии
app.delete('/api/sessions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM sessions WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting session:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновление кода сессии
app.patch('/api/sessions/:id/code', async (req, res) => {
    const { id } = req.params;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        await pool.query('UPDATE sessions SET code = $1 WHERE id = $2', [newCode, id]);
        res.json({ message: 'Session code updated successfully' });
    } catch (err) {
        console.error('Error updating session code:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Работа с пользователями
app.post('/api/users', async (req, res) => {
    const { username, password } = req.body;
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = new Date();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (id, username, password, created_at) VALUES ($1, $2, $3, $4)', [id, username, hashedPassword, createdAt]);
        res.status(201).json({ id, username, createdAt });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение всех пользователей
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Удаление пользователя
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновление пользователя
app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET username = $1, password = $2 WHERE id = $3', [username, hashedPassword, id]);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Эндпоинт для входа в админ-панель
app.post('/api/admins/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const admin = result.rows[0];

        // Здесь должна быть проверка пароля (например, с использованием bcrypt)
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Генерация токена
        const token = jwt.sign({ id: admin.id, access_level: admin.access_level }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error during admin login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Эндпоинт для изменения уровня доступа администратора
app.patch('/api/admins/:id/access-level', async (req, res) => {
    const { id } = req.params;
    const { access_level } = req.body;

    if (![1, 2, 3].includes(access_level)) {
        return res.status(400).json({ message: 'Invalid access level' });
    }

    try {
        await pool.query('UPDATE admins SET access_level = $1 WHERE id = $2', [access_level, id]);
        res.json({ message: 'Access level updated successfully' });
    } catch (err) {
        console.error('Error updating access level:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновленный эндпоинт для получения всех администраторов
app.get('/api/admins', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, access_level FROM admins');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await pool.end();
    console.log('PostgreSQL pool has ended');
    process.exit(0);
});
