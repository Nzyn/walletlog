const { pool, query } = require('./index');

const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

async function seed() {
    console.log(`\n${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}  WalletLog - Database Seeder${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bold}═══════════════════════════════════════════${COLORS.reset}\n`);

    try {
        // Check if categories table exists
        const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'categories'
      )
    `);

        if (!tableCheck.rows[0].exists) {
            console.log(`${COLORS.red}  ❌ Tables not found. Please run migrations first: npm run migrate${COLORS.reset}\n`);
            await pool.end();
            process.exit(1);
        }

        // Seed categories
        console.log(`${COLORS.yellow}  Seeding categories...${COLORS.reset}`);
        const categoryResult = await query(`
      INSERT INTO categories (name) VALUES 
        ('Savings'),
        ('School'),
        ('Food'),
        ('Income')
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `);
        console.log(`${COLORS.green}  ✅ Inserted ${categoryResult.rowCount} categories${COLORS.reset}`);

        // Get category IDs for transaction references
        const categories = await query('SELECT id, name FROM categories');
        const categoryMap = {};
        categories.rows.forEach(row => {
            categoryMap[row.name] = row.id;
        });

        // Seed transactions
        console.log(`${COLORS.yellow}  Seeding transactions...${COLORS.reset}`);
        const transactionResult = await query(`
      INSERT INTO transactions (name, amount, category_id, type, date) VALUES
        ('Salary', 3000.00, $1, 'income', '2024-01-01'),
        ('Groceries', 150.00, $2, 'expense', '2024-01-02'),
        ('Tuition', 500.00, $3, 'expense', '2024-01-03'),
        ('Investment Return', 200.00, $4, 'income', '2024-01-04')
      RETURNING id, name
    `, [
            categoryMap['Income'] || categoryMap['Savings'],
            categoryMap['Food'],
            categoryMap['School'],
            categoryMap['Savings'],
        ]);
        console.log(`${COLORS.green}  ✅ Inserted ${transactionResult.rowCount} transactions${COLORS.reset}`);

        console.log(`\n${COLORS.green}${COLORS.bold}  ✅ Database seeded successfully!${COLORS.reset}\n`);
    } catch (err) {
        console.error(`${COLORS.red}  ❌ Seeding failed: ${err.message}${COLORS.reset}\n`);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seed();
