const fs = require('fs');
const path = require('path');
const { pool, query } = require('./index');

const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

/**
 * Parse a migration SQL file into UP and DOWN parts
 */
function parseMigration(sql) {
    const upMatch = sql.match(/--\s*UP\s*\n([\s\S]*?)(?=--\s*DOWN|$)/i);
    const downMatch = sql.match(/--\s*DOWN\s*\n([\s\S]*?)$/i);

    return {
        up: upMatch ? upMatch[1].trim() : '',
        down: downMatch ? downMatch[1].trim() : '',
    };
}

/**
 * Ensure the migrations tracking table exists
 */
async function ensureMigrationsTable() {
    await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Get list of already applied migrations
 */
async function getAppliedMigrations() {
    const result = await query('SELECT name FROM migrations ORDER BY id');
    return result.rows.map(row => row.name);
}

/**
 * Get all migration files sorted by name
 */
function getMigrationFiles() {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
        console.log(`${COLORS.red}  ❌ Migrations directory not found: ${MIGRATIONS_DIR}${COLORS.reset}`);
        process.exit(1);
    }

    return fs
        .readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith('.sql'))
        .sort();
}

/**
 * Run pending migrations
 */
async function runMigrations() {
    console.log(`\n${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}  WalletLog - Database Migrations${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}\n`);

    await ensureMigrationsTable();

    const appliedMigrations = await getAppliedMigrations();
    const migrationFiles = getMigrationFiles();

    const pendingMigrations = migrationFiles.filter(
        file => !appliedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
        console.log(`${COLORS.green}  ✅ All migrations are up to date.${COLORS.reset}\n`);
        await pool.end();
        process.exit(0);
    }

    console.log(`${COLORS.yellow}  Found ${pendingMigrations.length} pending migration(s)${COLORS.reset}\n`);

    for (const file of pendingMigrations) {
        const filePath = path.join(MIGRATIONS_DIR, file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        const { up } = parseMigration(sql);

        if (!up) {
            console.log(`${COLORS.yellow}  ⚠️  Skipping ${file} - no UP migration found${COLORS.reset}`);
            continue;
        }

        try {
            console.log(`${COLORS.yellow}  ⏳ Running: ${file}...${COLORS.reset}`);
            await query(up);
            await query('INSERT INTO migrations (name) VALUES ($1)', [file]);
            console.log(`${COLORS.green}  ✅ Applied: ${file}${COLORS.reset}`);
        } catch (err) {
            console.error(`${COLORS.red}  ❌ Failed: ${file}${COLORS.reset}`);
            console.error(`${COLORS.red}  Error: ${err.message}${COLORS.reset}\n`);
            await pool.end();
            process.exit(1);
        }
    }

    console.log(`\n${COLORS.green}${COLORS.bold}  ✅ All migrations applied successfully!${COLORS.reset}\n`);
    await pool.end();
    process.exit(0);
}

/**
 * Rollback the last migration
 */
async function rollbackMigration() {
    console.log(`\n${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}  WalletLog - Migration Rollback${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}\n`);

    await ensureMigrationsTable();

    const result = await query('SELECT name FROM migrations ORDER BY id DESC LIMIT 1');

    if (result.rows.length === 0) {
        console.log(`${COLORS.yellow}  ⚠️  No migrations to rollback.${COLORS.reset}\n`);
        await pool.end();
        process.exit(0);
    }

    const lastMigration = result.rows[0].name;
    const filePath = path.join(MIGRATIONS_DIR, lastMigration);
    const sql = fs.readFileSync(filePath, 'utf-8');
    const { down } = parseMigration(sql);

    if (!down) {
        console.error(`${COLORS.red}  ❌ No DOWN migration found in ${lastMigration}${COLORS.reset}\n`);
        await pool.end();
        process.exit(1);
    }

    try {
        console.log(`${COLORS.yellow}  ⏳ Rolling back: ${lastMigration}...${COLORS.reset}`);
        await query(down);
        await query('DELETE FROM migrations WHERE name = $1', [lastMigration]);
        console.log(`${COLORS.green}  ✅ Rolled back: ${lastMigration}${COLORS.reset}\n`);
    } catch (err) {
        console.error(`${COLORS.red}  ❌ Rollback failed: ${lastMigration}${COLORS.reset}`);
        console.error(`${COLORS.red}  Error: ${err.message}${COLORS.reset}\n`);
        await pool.end();
        process.exit(1);
    }

    await pool.end();
    process.exit(0);
}

// Check for --rollback flag
const isRollback = process.argv.includes('--rollback');
if (isRollback) {
    rollbackMigration();
} else {
    runMigrations();
}
