const PROTECTED_TABLES_DEFAULT = new Set(['system_admins']);
const SYSTEM_TABLES = new Set(['schema_migrations']);

function parseOptions(args) {
  const flags = new Set(args || []);
  return {
    withAdmin: flags.has('--with-admin')
  };
}

async function listTables(connection, databaseName) {
  const [rows] = await connection.query(
    `SELECT TABLE_NAME
       FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME`,
    [databaseName]
  );
  return rows.map((r) => r.TABLE_NAME);
}

async function countRows(connection, tableName) {
  const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM \`${tableName}\``);
  return Number(rows[0]?.total || 0);
}

async function run({ connection, args, config }) {
  const { withAdmin } = parseOptions(args);
  console.log(`[db-clear] Connected to database: ${config.database}`);

  const allTables = await listTables(connection, config.database);
  if (!allTables.length) {
    console.log('[db-clear] No tables found. Nothing to clear.');
    return;
  }

  const protectedTables = new Set(PROTECTED_TABLES_DEFAULT);
  if (withAdmin) {
    protectedTables.delete('system_admins');
  }

  const candidateTables = allTables.filter(
    (t) => !protectedTables.has(t) && !SYSTEM_TABLES.has(t)
  );

  console.log('\n[db-clear] Tables detected:');
  allTables.forEach((t) => {
    const tag = protectedTables.has(t) ? ' (protected)' : '';
    console.log(`- ${t}${tag}`);
  });

  let totalRows = 0;
  const beforeCounts = [];
  for (const tableName of allTables) {
    const rows = await countRows(connection, tableName);
    beforeCounts.push({ tableName, rows });
    totalRows += rows;
  }

  console.log('\n[db-clear] Row counts before clear:');
  beforeCounts.forEach(({ tableName, rows }) => {
    console.log(`- ${tableName}: ${rows}`);
  });
  console.log(`[db-clear] Total rows: ${totalRows}`);

  if (!candidateTables.length) {
    console.log('\n[db-clear] No clearable tables found (all protected/system).');
    return;
  }

  const clearableRows = beforeCounts
    .filter(({ tableName }) => candidateTables.includes(tableName))
    .reduce((sum, r) => sum + r.rows, 0);

  if (clearableRows === 0) {
    console.log('\n[db-clear] Clearable tables already empty. Nothing to do.');
    return;
  }

  console.log('\n[db-clear] Clearing data...');
  console.log(`[db-clear] Protected tables: ${[...protectedTables].join(', ') || '(none)'}`);

  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const tableName of candidateTables) {
    await connection.query(`DELETE FROM \`${tableName}\``);
    console.log(`- cleared ${tableName}`);
  }
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');

  console.log('\n[db-clear] Row counts after clear:');
  const afterCounts = [];
  for (const tableName of allTables) {
    const rows = await countRows(connection, tableName);
    afterCounts.push({ tableName, rows });
    console.log(`- ${tableName}: ${rows}`);
  }

  const remainingInCleared = afterCounts
    .filter(({ tableName }) => candidateTables.includes(tableName))
    .reduce((sum, r) => sum + r.rows, 0);

  if (remainingInCleared === 0) {
    console.log('\n[db-clear] Success: selected tables were fully cleared.');
    return;
  }

  throw new Error('Some rows remain in cleared tables.');
}

module.exports = { run };
