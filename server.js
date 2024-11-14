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

// 1. Управление администратором
app.get('/api/admin', async (req, res) => {
    const result = await pool.query('SELECT * FROM settings LIMIT 1');
    res.json(result.rows[0]);
});
app.patch('/api/admin', async (req, res) => {
    const { adminName, password, titleSite } = req.body;
    await pool.query('UPDATE settings SET adminName = $1, password = $2, titleSite = $3', [adminName, password, titleSite]);
    res.json({ message: 'Admin settings updated successfully' });
});

// 2. Работа с сеансами
app.post('/api/sessions', async (req, res) => {
    const { name, type } = req.body;
    const id = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация id
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация code
    const createdAt = new Date();
    const devices = 0;

    await pool.query('INSERT INTO sessions (id, name, createdAt, devices, type, code) VALUES ($1, $2, $3, $4, $5, $6)', [id, name, createdAt, devices, type, code]);
    res.status(201).json({ id, name, createdAt, devices, type, code });
});

app.get('/api/sessions', async (req, res) => {
    const result = await pool.query('SELECT * FROM sessions');
    res.json(result.rows);
});

app.delete('/api/sessions/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM sessions WHERE id = $1', [id]);
    res.status(204).send();
});

app.patch('/api/sessions/:id/code', async (req, res) => {
    const { id } = req.params;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString(); // Новый код
    await pool.query('UPDATE sessions SET code = $1 WHERE id = $2', [newCode, id]);
    res.json({ message: 'Session code updated successfully' });
});

// 3. Работа с данными
app.get('/api/data', async (req, res) => {
    const result = await pool.query('SELECT * FROM data');
    res.json(result.rows);
});

app.post('/api/data', async (req, res) => {
    const { name } = req.body;
    const id = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация id
    const createdAt = new Date();
    const candidates = [];

    await pool.query('INSERT INTO data (id, createdAt, name, candidates) VALUES ($1, $2, $3, $4)', [id, createdAt, name, candidates]);
    res.status(201).json({ id, createdAt, name, candidates });
});

app.patch('/api/data/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await pool.query('UPDATE data SET name = $1 WHERE id = $2', [name, id]);
    res.json({ message: 'Data name updated successfully' });
});

// 4. Управление кандидатами
app.post('/api/data/:id/candidates', async (req, res) => {
    const { id } = req.params;
    const { fullName, class: className, photo } = req.body;
    const candidateId = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация id
    const createdAt = new Date();
    const votes = 0;

    await pool.query('INSERT INTO candidates (id, dataId, fullName, class, photo, createdAt, votes) VALUES ($1, $2, $3, $4, $5, $6, $7)', [candidateId, id, fullName, className, photo, createdAt, votes]);
    res.status(201).json({ id: candidateId, createdAt, fullName, className, photo, votes });
});

app.delete('/api/data/:dataId/candidates/:candidateId', async (req, res) => {
    const { dataId, candidateId } = req.params;
    await pool.query('DELETE FROM candidates WHERE id = $1 AND dataId = $2', [candidateId, dataId]);
    res.status(204).send();
});

app.patch('/api/data/:dataId/candidates/:candidateId', async (req, res) => {
    const { dataId, candidateId } = req.params;
    const { fullName, class: className, photo } = req.body;
    await pool.query('UPDATE candidates SET fullName = $1, class = $2, photo = $3 WHERE id = $4 AND dataId = $5', [fullName, className, photo, candidateId, dataId]);
    res.json({ message: 'Candidate information updated successfully' });
});

app.patch('/api/data/:dataId/candidates/:candidateId/vote', async (req, res) => {
    const { dataId, candidateId } = req.params;
    await pool.query('UPDATE candidates SET votes = votes + 1 WHERE id = $1 AND dataId = $2', [candidateId, dataId]);
    res.json({ message: 'Vote count updated successfully' });
});

app.listen(port, '46.16.36.208', () => {
    console.log(`Server running at http://46.16.36.208:${port}`);
});
