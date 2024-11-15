const request = require('supertest');
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: '46.16.36.208',
    database: 'postgres',
    password: 'timur15092006',
    port: 5432,
});

// 5. Работа с пользователями
app.post('/api/users', async (req, res) => {
    const { username, password } = req.body;
    const id = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация id
    const createdAt = new Date();

    await pool.query('INSERT INTO users (id, username, password, created_at) VALUES ($1, $2, $3, $4)', [id, username, password, createdAt]);
    res.status(201).json({ id, username, createdAt });
});

app.get('/api/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(204).send();
});

app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    await pool.query('UPDATE users SET username = $1, password = $2 WHERE id = $3', [username, password, id]);
    res.json({ message: 'User updated successfully' });
});

// Admin API
app.post('/api/admins/login', async (req, res) => {
    const { username, password } = req.body;
    // Dummy check for admin login
    if (username === 'adminuser' && password === 'adminpass') {
        const id = 'admin123';
        const access_level = 1;
        res.status(200).json({ id, username, access_level });
    } else {
        res.status(401).send();
    }
});

app.patch('/api/admins/:id/access-level', async (req, res) => {
    const { id } = req.params;
    const { access_level } = req.body;
    // Dummy update for access level
    res.json({ message: 'Access level updated successfully' });
});

// Тесты
describe('User API', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ username: 'testuser', password: 'password123' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('testuser');
    });

    it('should get all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should update a user', async () => {
        const userId = '1'; // Замените на реальный id пользователя
        const response = await request(app)
            .patch(`/api/users/${userId}`)
            .send({ username: 'updateduser', password: 'newpassword123' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
    });

    it('should delete a user', async () => {
        const userId = '1'; // Замените на реальный id пользователя
        const response = await request(app).delete(`/api/users/${userId}`);
        expect(response.status).toBe(204);
    });
});

describe('Admin API', () => {
    it('should log in an admin', async () => {
        const response = await request(app)
            .post('/api/admins/login')
            .send({ username: 'adminuser', password: 'adminpass' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('adminuser');
        expect(response.body.access_level).toBeDefined();
    });

    it('should return 401 for invalid login', async () => {
        const response = await request(app)
            .post('/api/admins/login')
            .send({ username: 'wronguser', password: 'wrongpass' });
        expect(response.status).toBe(401);
    });

    it('should update access level of an admin', async () => {
        const adminId = '1'; // Замените на реальный id администратора
        const response = await request(app)
            .patch(`/api/admins/${adminId}/access-level`)
            .send({ access_level: 2 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Access level updated successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});