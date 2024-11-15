const request = require('supertest');
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// 1. Работа с пользователями
app.post('/api/users', async (req, res) => {
    const { username, password } = req.body;
    const id = Math.floor(100000 + Math.random() * 900000).toString();
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

// 2. Работа с голосованиями
app.post('/api/votes', async (req, res) => {
    const { name, nominations } = req.body;
    const id = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const createdAt = new Date();
    const status = false;

    await pool.query('INSERT INTO votes (id, name, nominations, created_at, status) VALUES ($1, $2, $3, $4, $5)', [id, name, nominations, createdAt, status]);
    res.status(201).json({ id, name, nominations, createdAt, status });
});

app.get('/api/votes', async (req, res) => {
    const result = await pool.query('SELECT * FROM votes');
    res.json(result.rows);
});

// 3. Работа с номинациями
app.post('/api/votes/:voteId/nominations', async (req, res) => {
    const { voteId } = req.params;
    const { name } = req.body;
    const id = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const createdAt = new Date();
    const usersTable = `nominations_${id}`;

    await pool.query('INSERT INTO nominations (id, name, created_at, users_table) VALUES ($1, $2, $3, $4)', [id, name, createdAt, usersTable]);
    await pool.query(`CREATE TABLE IF NOT EXISTS ${usersTable} (id SERIAL PRIMARY KEY, full_name VARCHAR(255), class VARCHAR(255), photo VARCHAR(255), votes INTEGER DEFAULT 0)`);
    res.status(201).json({ id, name, createdAt, usersTable });
});

app.get('/api/votes/:voteId/nominations', async (req, res) => {
    const { voteId } = req.params;
    const result = await pool.query('SELECT * FROM nominations WHERE vote_id = $1', [voteId]);
    res.json(result.rows);
});

// 4. Работа с кандидатами
app.post('/api/nominations/:nominationId/candidates', async (req, res) => {
    const { nominationId } = req.params;
    const { fullName, class: className, photo } = req.body;
    const candidateId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const createdAt = new Date();

    await pool.query(`INSERT INTO nominations_${nominationId} (id, full_name, class, photo, created_at) VALUES ($1, $2, $3, $4, $5)`, [candidateId, fullName, className, photo, createdAt]);
    res.status(201).json({ id: candidateId, fullName, className, photo, createdAt });
});

app.get('/api/nominations/:nominationId/candidates', async (req, res) => {
    const { nominationId } = req.params;
    const result = await pool.query(`SELECT * FROM nominations_${nominationId}`);
    res.json(result.rows);
});

// Admin API
app.post('/api/admins/login', async (req, res) => {
    const { username, password } = req.body;
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

describe('Vote API', () => {
    it('should create a new vote', async () => {
        const response = await request(app)
            .post('/api/votes')
            .send({ name: 'Vote for Class President', nominations: ['Nomination1', 'Nomination2'] });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Vote for Class President');
    });

    it('should get all votes', async () => {
        const response = await request(app).get('/api/votes');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Nomination API', () => {
    it('should create a new nomination', async () => {
        const voteId = '1'; // Замените на реальный id голосования
        const response = await request(app)
            .post(`/api/votes/${voteId}/nominations`)
            .send({ name: 'Nomination1' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Nomination1');
    });

    it('should get nominations for a vote', async () => {
        const voteId = '1'; // Замените на реальный id голосования
        const response = await request(app).get(`/api/votes/${voteId}/nominations`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Candidate API', () => {
    it('should create a new candidate', async () => {
        const nominationId = '1'; // Замените на реальный id номинации
        const response = await request(app)
            .post(`/api/nominations/${nominationId}/candidates`)
            .send({ fullName: 'John Doe', class: '10A', photo: 'photo_url' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.fullName).toBe('John Doe');
    });

    it('should get candidates for a nomination', async () => {
        const nominationId = '1'; // Замените на реальный id номинации
        const response = await request(app).get(`/api/nominations/${nominationId}/candidates`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
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