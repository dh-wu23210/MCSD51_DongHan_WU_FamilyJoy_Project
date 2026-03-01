#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let mysql;
try {
  mysql = require('mysql2/promise');
} catch (error) {
  mysql = require(path.join(__dirname, '..', 'src', 'node_modules', 'mysql2', 'promise'));
}

let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (error) {
  bcrypt = require(path.join(__dirname, '..', 'src', 'node_modules', 'bcryptjs'));
}

const TASK_MAP = {
  'seed-admin': path.join(__dirname, 'db_tasks', 'seed-admin-task'),
  clear: path.join(__dirname, 'db_tasks', 'clear-db-task'),
  'seed-xml': path.join(__dirname, 'db_tasks', 'seed-xml-test-data-task')
};

const TASK_HELP = {
  'seed-admin': [
    'Usage:',
    '  node tools/db-tool.js seed-admin',
    '',
    'Description:',
    '  Create or update the system admin account.'
  ].join('\n'),
  clear: [
    'Usage:',
    '  node tools/db-tool.js clear [--with-admin]',
    '',
    'Description:',
    '  Clear all application data while preserving table structure.',
    '  Default keeps system_admins rows; use --with-admin to clear them too.'
  ].join('\n'),
  'seed-xml': [
    'Usage:',
    '  node tools/db-tool.js seed-xml [--file <xmlPath>]',
    '',
    'Description:',
    '  Seed test families/users from XML file.',
    '  Default file: tools/test_data/test-users-families.xml'
  ].join('\n')
};

function getDbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME
  };
}

function printUsage() {
  console.log('Usage:');
  console.log('  node tools/db-tool.js <task> [options]');
  console.log('');
  console.log('Tasks:');
  console.log('  seed-admin           Create/update system admin account');
  console.log('  clear [--with-admin] Clear database data (keep system_admins by default)');
  console.log('  seed-xml [--file]    Seed test families/users from XML');
}

async function runCli(argv = process.argv.slice(2)) {
  const [taskName, ...args] = argv;
  if (!taskName || taskName === '-h' || taskName === '--help') {
    printUsage();
    return;
  }

  const taskModulePath = TASK_MAP[taskName];
  if (!taskModulePath) {
    console.error(`[db-tool] Unknown task: ${taskName}`);
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (args.includes('-h') || args.includes('--help')) {
    console.log(TASK_HELP[taskName] || 'No help available for this task.');
    return;
  }

  const config = getDbConfig();
  if (!config.user || !config.database) {
    console.error('[db-tool] Missing DB_USER or DB_NAME in .env');
    process.exitCode = 1;
    return;
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const task = require(taskModulePath);
    if (!task || typeof task.run !== 'function') {
      throw new Error(`Invalid task module: ${taskName}`);
    }
    const deps = { bcrypt };
    await task.run({ connection, args, config, deps });
  } catch (error) {
    const detail = error && (error.sqlMessage || error.code || error.message || String(error));
    console.error(`[db-tool] Failed: ${detail}`);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
      console.log('[db-tool] Connection closed.');
    }
  }
}

if (require.main === module) {
  runCli();
}

module.exports = { runCli };
