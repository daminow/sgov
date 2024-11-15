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

// Создание таблицы users, если она не существует
const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await pool.query(query);
};

// Вызов функции создания таблицы при запуске сервера
createUsersTable().catch(err => console.error('Error creating users table:', err));

// 1. Работа с голосованиями
app.post('/api/votes', async (req, res) => {
    const { name, nominations } = req.body;
    const id = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // Генерация id
    const createdAt = new Date();
    const status = false;

    await pool.query('INSERT INTO votes (id, name, nominations, created_at, status) VALUES ($1, $2, $3, $4, $5)', [id, name, nominations, createdAt, status]);
    res.status(201).json({ id, name, nominations, createdAt, status });
});

app.get('/api/votes', async (req, res) => {
    const result = await pool.query('SELECT * FROM votes');
    res.json(result.rows);
});

app.delete('/api/votes/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM votes WHERE id = $1', [id]);
    res.status(204).send();
});

app.patch('/api/votes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, nominations, status } = req.body;
    await pool.query('UPDATE votes SET name = $1, nominations = $2, status = $3 WHERE id = $4', [name, nominations, status, id]);
    res.json({ message: 'Vote updated successfully' });
});

// 2. Работа с номинациями
app.post('/api/votes/:voteId/nominations', async (req, res) => {
    const { voteId } = req.params;
    const { name } = req.body;
    const id = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // Генерация id
    const createdAt = new Date();
    const usersTable = `nominations_${id}`;

    await pool.query('INSERT INTO nominations (id, name, created_at, users_table) VALUES ($1, $2, $3, $4)', [id, name, createdAt, usersTable]);
    await pool.query(`CREATE TABLE ${usersTable} (id SERIAL PRIMARY KEY, full_name VARCHAR(255), class VARCHAR(255), photo VARCHAR(255), votes INTEGER DEFAULT 0)`); // Создание таблицы для кандидатов
    res.status(201).json({ id, name, createdAt, usersTable });
});

app.get('/api/votes/:voteId/nominations', async (req, res) => {
    const { voteId } = req.params;
    const result = await pool.query('SELECT * FROM nominations WHERE vote_id = $1', [voteId]);
    res.json(result.rows);
});

app.delete('/api/votes/:voteId/nominations/:nominationId', async (req, res) => {
    const { nominationId } = req.params;
    await pool.query('DELETE FROM nominations WHERE id = $1', [nominationId]);
    res.status(204).send();
});

// 3. Работа с кандидатами
app.post('/api/nominations/:nominationId/candidates', async (req, res) => {
    const { nominationId } = req.params;
    const { fullName, class: className, photo } = req.body;
    const candidateId = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // Генерация id
    const createdAt = new Date();

    await pool.query(`INSERT INTO nominations_${nominationId} (id, full_name, class, photo, created_at) VALUES ($1, $2, $3, $4, $5)`, [candidateId, fullName, className, photo, createdAt]);
    res.status(201).json({ id: candidateId, fullName, className, photo, createdAt });
});

app.get('/api/nominations/:nominationId/candidates', async (req, res) => {
    const { nominationId } = req.params;
    const result = await pool.query(`SELECT * FROM nominations_${nominationId}`);
    res.json(result.rows);
});

app.patch('/api/nominations/:nominationId/candidates/:candidateId', async (req, res) => {
    const { nominationId, candidateId } = req.params;
    const { fullName, class: className, photo } = req.body;
    await pool.query(`UPDATE nominations_${nominationId} SET full_name = $1, class = $2, photo = $3 WHERE id = $4`, [fullName, className, photo, candidateId]);
    res.json({ message: 'Candidate information updated successfully' });
});

app.delete('/api/nominations/:nominationId/candidates/:candidateId', async (req, res) => {
    const { nominationId, candidateId } = req.params;
    await pool.query(`DELETE FROM nominations_${nominationId} WHERE id = $1`, [candidateId]);
    res.status(204).send();
});

app.patch('/api/nominations/:nominationId/candidates/:candidateId/vote', async (req, res) => {
    const { nominationId, candidateId } = req.params;
    await pool.query(`UPDATE nominations_${nominationId} SET votes = votes + 1 WHERE id = $1`, [candidateId]);
    res.json({ message: 'Vote count updated successfully' });
});

// 4. Работа с сессиями
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

// Эндпоинт для входа в админ-панель
app.post('/api/admins/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

    if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = result.rows[0];

    // Здесь должна быть проверка пароля (например, с использованием bcrypt)
    if (admin.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({ id: admin.id, username: admin.username, access_level: admin.access_level });
});

// Эндпоинт для изменения уровня доступа администратора
app.patch('/api/admins/:id/access-level', async (req, res) => {
    const { id } = req.params;
    const { access_level } = req.body;

    if (![1, 2, 3].includes(access_level)) {
        return res.status(400).json({ message: 'Invalid access level' });
    }

    await pool.query('UPDATE admins SET access_level = $1 WHERE id = $2', [access_level, id]);
    res.json({ message: 'Access level updated successfully' });
});

// Обновленный эндпоинт для получения всех администраторов
app.get('/api/admins', async (req, res) => {
    const result = await pool.query('SELECT id, username, access_level FROM admins');
    res.json(result.rows);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
