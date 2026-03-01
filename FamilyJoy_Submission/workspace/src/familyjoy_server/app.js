/** Module: app. Handles app responsibilities. */

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MySQLStoreFactory = require('express-mysql-session');
const mysql2 = require('mysql2');

const app = express();
const clientRoot = path.join(__dirname, '..', 'familyjoy_client');
const clientViewsDir = path.join(clientRoot, 'views');
const clientPublicDir = path.join(clientRoot, 'public');

const adminViewsDir = path.join(__dirname, '..', 'familyjoy_admin', 'views');
const adminPublicDir = path.join(__dirname, '..', 'familyjoy_admin', 'public');


app.set('views', [clientViewsDir, adminViewsDir]);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/nonavigated_layout');
app.set('layout extractScripts', false);
app.set('layout extractStyles', false);

// Use express-ejs-layouts for layout support
app.use(expressLayouts);

app.use(express.static(clientPublicDir));
app.use('/admin', express.static(adminPublicDir));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const config = require('./config');
const db = require('./models/db-connector');
const maintenanceService = require('./services/maintenanceService');
const { buildPageDefaults } = require('./viewModels/pageDefaults');
const { getAssetPath } = require('./constants/assets');
const { requireAuth, requirePasswordChange } = require('./middleware/auth');

app.locals.title = 'FamilyJoy Demo';
app.locals.header = 'FamilyJoy (Demo)';
app.locals.assetPath = (key, fallback = '') => getAssetPath(key, fallback);

// Use MySQL-backed session store (express-mysql-session) with mysql2
// Note: express-mysql-session expects a promise-based connection
const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({}, db.promise);
sessionStore.on('error', (err) => {
  console.error('Session store error:', err);
});

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));


// Mount authentication routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Mount admin portal routes early, before member-protected business routers
const adminRoutes = require('../familyjoy_admin/server/routes/admin_routes');
app.use('/', adminRoutes);

// Global guard for all main-app protected routes:
// authenticated members using initial/default password must change it first.
app.use(requireAuth, requirePasswordChange);


// Mount dashboard route
const dashboardRoutes = require('./routes/dashboard');
const wishRoutes = require('./routes/wish');
app.use('/', dashboardRoutes);
app.use('/', wishRoutes);

// Mount quest routes
const questRoutes = require('./routes/quest');
app.use('/', questRoutes);

// Mount user/profile routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes);

// Mount family routes
const familyRoutes = require('./routes/family');
app.use('/', familyRoutes);

// Mount shop routes
const shopRoutes = require('./routes/shop');
app.use('/', shopRoutes);

// Mount calendar routes
const calendarRoutes = require('./routes/calendar');
app.use('/', calendarRoutes);

// Mount mailbox routes
const mailboxRoutes = require('./routes/mailbox');
app.use('/', mailboxRoutes);

// Mount spirit tree routes
const spiritTreeRoutes = require('./routes/spiritTree');
app.use('/', spiritTreeRoutes);

// 404 handler (after all routes)
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    const user = req.session && req.session.user ? req.session.user : null;
    return res.render('pages/error/error', {
      ...buildPageDefaults({
        user,
        current: '',
        message: '',
        error: 'Page not found'
      }),
      errorMessage: 'Page not found'
    });
  }
  return res.json({ error: 'Not Found' });
});


// Scheduled cleanup for disabled members
async function cleanupDisabledMembers() {
  try {
    await maintenanceService.cleanupDisabledMembers();
  } catch (error) {
    console.error('Cleanup disabled members error:', error);
  }
}

cleanupDisabledMembers();
setInterval(cleanupDisabledMembers, 60 * 60 * 1000);

// Global error handler (should be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server only when run directly, not when required for tests
if (require.main === module) {
  const server = app.listen(config.serverPort, () => console.log(`Server started at http://localhost:${config.serverPort}`));
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${config.serverPort} is already in use. Choose another port or stop the process using it.`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
}

module.exports = app;

