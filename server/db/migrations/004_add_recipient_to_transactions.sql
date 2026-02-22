-- Migration: 004_add_recipient_to_transactions
-- Description: Add recipient column to transactions table

-- UP
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recipient VARCHAR(255);

-- DOWN
ALTER TABLE transactions DROP COLUMN IF EXISTS recipient;
