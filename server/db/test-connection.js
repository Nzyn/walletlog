const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

async function testConnection() {
    console.log(`\n${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}  WalletLog - Database Connection Test${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}\n`);

    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'walletlog',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
    };

    console.log(`${COLORS.yellow}Connection Details:${COLORS.reset}`);
    console.log(`  Host:     ${config.host}`);
    console.log(`  Port:     ${config.port}`);
    console.log(`  Database: ${config.database}`);
    console.log(`  User:     ${config.user}`);
    console.log('');

    // Step 1: Test basic PostgreSQL connectivity (connect to 'postgres' default db)
    console.log(`${COLORS.yellow}Step 1: Testing PostgreSQL server connectivity...${COLORS.reset}`);
    const pgPool = new Pool({
        host: config.host,
        port: config.port,
        database: 'postgres',
        user: config.user,
        password: config.password,
    });

    try {
        const pgClient = await pgPool.connect();
        const serverResult = await pgClient.query('SELECT version()');
        console.log(`${COLORS.green}  ✅ PostgreSQL server is running${COLORS.reset}`);
        console.log(`  ${serverResult.rows[0].version.split(',')[0]}\n`);

        // Step 2: Check if the walletlog database exists
        console.log(`${COLORS.yellow}Step 2: Checking if '${config.database}' database exists...${COLORS.reset}`);
        const dbCheck = await pgClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [config.database]
        );

        if (dbCheck.rows.length === 0) {
            console.log(`${COLORS.yellow}  ⚠️  Database '${config.database}' does not exist. Creating it...${COLORS.reset}`);
            await pgClient.query(`CREATE DATABASE ${config.database}`);
            console.log(`${COLORS.green}  ✅ Database '${config.database}' created successfully${COLORS.reset}\n`);
        } else {
            console.log(`${COLORS.green}  ✅ Database '${config.database}' exists${COLORS.reset}\n`);
        }

        pgClient.release();
        await pgPool.end();
    } catch (err) {
        console.error(`${COLORS.red}  ❌ Failed to connect to PostgreSQL server${COLORS.reset}`);
        console.error(`${COLORS.red}  Error: ${err.message}${COLORS.reset}\n`);
        await pgPool.end();
        process.exit(1);
    }

    // Step 3: Connect to the walletlog database
    console.log(`${COLORS.yellow}Step 3: Connecting to '${config.database}' database...${COLORS.reset}`);
    const appPool = new Pool(config);

    try {
        const client = await appPool.connect();
        const timeResult = await client.query('SELECT NOW() AS current_time');
        console.log(`${COLORS.green}  ✅ Connected to '${config.database}' successfully${COLORS.reset}`);
        console.log(`  Server time: ${timeResult.rows[0].current_time}\n`);

        // Step 4: Check existing tables
        console.log(`${COLORS.yellow}Step 4: Checking existing tables...${COLORS.reset}`);
        const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

        if (tablesResult.rows.length === 0) {
            console.log(`${COLORS.yellow}  ⚠️  No tables found. Run migrations to create tables.${COLORS.reset}\n`);
        } else {
            console.log(`${COLORS.green}  Found ${tablesResult.rows.length} table(s):${COLORS.reset}`);
            tablesResult.rows.forEach(row => {
                console.log(`    - ${row.table_name}`);
            });
            console.log('');
        }

        client.release();
        await appPool.end();

        console.log(`${COLORS.green}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}`);
        console.log(`${COLORS.green}${COLORS.bold}  ✅ All connection tests passed!${COLORS.reset}`);
        console.log(`${COLORS.green}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}\n`);
        process.exit(0);
    } catch (err) {
        console.error(`${COLORS.red}  ❌ Failed to connect to '${config.database}'${COLORS.reset}`);
        console.error(`${COLORS.red}  Error: ${err.message}${COLORS.reset}\n`);
        await appPool.end();
        process.exit(1);
    }
}

testConnection();
