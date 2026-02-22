const express = require('express');
const cors = require('cors');
const { query } = require('./db/index');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const result = await query('SELECT * FROM transactions ORDER BY date DESC, created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add a transaction
app.post('/api/transactions', async (req, res) => {
    const { name, amount, category_id, type, date, recipient } = req.body;
    try {
        const result = await query(
            'INSERT INTO transactions (name, amount, category_id, type, date, recipient) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, amount, category_id, type, date || new Date(), recipient]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const result = await query('SELECT * FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add a category
app.post('/api/categories', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
