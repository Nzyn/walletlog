const { pool, query } = require('./index');

async function verify() {
    console.log('\n=== VERIFICATION ===\n');

    const tables = await query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('Tables:', tables.rows.map(r => r.table_name).join(', '));

    const cats = await query('SELECT * FROM categories');
    console.log('\nCategories:');
    cats.rows.forEach(r => console.log(`  [${r.id}] ${r.name}`));

    const txns = await query('SELECT id, name, amount, type, date FROM transactions');
    console.log('\nTransactions:');
    txns.rows.forEach(r => console.log(`  [${r.id}] ${r.name} - ${r.type} $${r.amount} on ${r.date.toISOString().slice(0, 10)}`));

    const migs = await query('SELECT name, applied_at FROM migrations ORDER BY id');
    console.log('\nApplied Migrations:');
    migs.rows.forEach(r => console.log(`  ${r.name} (${r.applied_at.toISOString()})`));

    console.log('\n=== ALL GOOD ===\n');
    await pool.end();
}

verify().catch(e => { console.error(e); process.exit(1); });
