# PostgreSQL Database Setup for WalletLog

This document outlines the planned PostgreSQL database structure for the WalletLog application.

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    type VARCHAR(50) CHECK (type IN ('income', 'expense')) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Users Table (for future authentication)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Sample Data

```sql
-- Insert default categories
INSERT INTO categories (name) VALUES ('Savings'), ('School'), ('Food');

-- Insert sample transactions
INSERT INTO transactions (name, amount, category_id, type, date) VALUES
('Salary', 3000.00, 1, 'income', '2024-01-01'),
('Groceries', 150.00, 3, 'expense', '2024-01-02'),
('Tuition', 500.00, 2, 'expense', '2024-01-03'),
('Investment Return', 200.00, 1, 'income', '2024-01-04');
```

## Connection Setup

For development, you can use the following connection details:

- Host: localhost
- Port: 5432
- Database: walletlog
- Username: walletlog_user
- Password: walletlog_password

## Environment Variables

Create a `.env` file in the root directory with the following content:

```
DATABASE_URL=postgresql://walletlog_user:walletlog_password@localhost:5432/walletlog
```

## Future Implementation

The database integration will be implemented using a backend API built with Node.js/Express or a framework like Next.js API routes. The frontend will communicate with the backend via RESTful APIs or GraphQL.