-- Migration: 003_create_transactions
-- Description: Create the transactions table with foreign key to categories

-- UP
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(50) CHECK (type IN ('income', 'expense')) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOWN
DROP TABLE IF EXISTS transactions;
