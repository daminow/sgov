const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;
app.use(express.json());
// PostgreSQL connection
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
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
    const code = Math.random().toString(36).substring(2, 8);
    await pool.query('INSERT INTO sessions (id, name, type) VALUES ($1, $2, $3)', [code, name, type]);
    res.status(201).json({ id: code });
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
    const newCode = Math.random().toString(36).substring(2, 8);
    await pool.query('UPDATE sessions SET id = $1 WHERE id = $2', [newCode, id]);
    res.json({ message: 'Session code updated successfully' });
});
// 3. Работа с данными
app.get('/api/data', async (req, res) => {
    const result = await pool.query('SELECT * FROM data');
    res.json(result.rows);
});
app.post('/api/data', async (req, res) => {
    const { name } = req.body;
    const id = Math.random().toString(36).substring(2, 8);
    await pool.query('INSERT INTO data (id, name) VALUES ($1, $2)', [id, name]);
    res.status(201).json({ id });
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
    const candidateId = Math.random().toString(36).substring(2, 8);
    await pool.query('INSERT INTO candidates (id, dataId, fullName, class, photo) VALUES ($1, $2, $3, $4, $5)', [candidateId, id, fullName, className, photo]);
    res.status(201).json({ id: candidateId });
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
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});