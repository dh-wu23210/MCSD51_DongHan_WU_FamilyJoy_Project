const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_XML_PATH = path.join(__dirname, '..', 'test_data', 'test-users-families.xml');
const SLOT_CODES = ['A', 'B', 'C', 'D', 'E'];
const QUEST_STATUSES = ['assigned', 'submitted', 'complete', 'incomplete'];

function parseOptions(args) {
  const options = {
    filePath: DEFAULT_XML_PATH,
    days: null
  };

  for (let i = 0; i < (args || []).length; i += 1) {
    const token = args[i];
    if (token === '--file' && args[i + 1]) {
      options.filePath = path.isAbsolute(args[i + 1])
        ? args[i + 1]
        : path.join(process.cwd(), args[i + 1]);
      i += 1;
      continue;
    }
    if (token === '--days' && args[i + 1]) {
      options.days = Math.max(1, Number(args[i + 1]) || 10);
      i += 1;
    }
  }
  return options;
}

function extractAttributes(attrText) {
  const attrs = {};
  const attrRegex = /([a-zA-Z_][\w-]*)="([^"]*)"/g;
  let match;
  while ((match = attrRegex.exec(attrText)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function parseSelfClosingTags(blockText, tagName) {
  const results = [];
  const regex = new RegExp(`<${tagName}\\s+([^/>]+)\\/>`, 'g');
  let match;
  while ((match = regex.exec(blockText)) !== null) {
    results.push(extractAttributes(match[1]));
  }
  return results;
}

function parseFixture(xmlText) {
  const fixtureOpen = xmlText.match(/<fixture\s+([^>]+)>/);
  const fixtureAttrs = fixtureOpen ? extractAttributes(fixtureOpen[1]) : {};
  const families = [];
  const familyRegex = /<family\s+([^>]+)>([\s\S]*?)<\/family>/g;
  let familyMatch;

  while ((familyMatch = familyRegex.exec(xmlText)) !== null) {
    const familyAttrs = extractAttributes(familyMatch[1]);
    const body = familyMatch[2];
    families.push({
      name: familyAttrs.name || '',
      familyCode: (familyAttrs.familyCode || '').toUpperCase(),
      profile: (familyAttrs.profile || 'low').toLowerCase(),
      createdDaysAgo: Math.max(0, Number(familyAttrs.createdDaysAgo || 0)),
      days: Math.max(1, Number(familyAttrs.days || 0)),
      members: parseSelfClosingTags(body, 'member'),
      questDefinitions: parseSelfClosingTags(body, 'quest'),
      rewards: parseSelfClosingTags(body, 'reward')
    });
  }

  return {
    days: Math.max(1, Number(fixtureAttrs.days || 10)),
    families
  };
}

function validateFixture(fixture) {
  if (!fixture.families.length) {
    throw new Error('No <family> entries found in XML.');
  }

  for (const family of fixture.families) {
    if (!family.name || !family.familyCode || family.familyCode.length !== 4) {
      throw new Error(`Invalid family node: ${JSON.stringify(family)}`);
    }
    if (!family.members.length) {
      throw new Error(`Family ${family.familyCode} has no members.`);
    }
    if (!family.questDefinitions.length) {
      throw new Error(`Family ${family.familyCode} has no quest definitions.`);
    }
    if (!family.rewards.length) {
      throw new Error(`Family ${family.familyCode} has no rewards.`);
    }
    for (const member of family.members) {
      const role = (member.role || 'child').toLowerCase();
      if (!member.username || !member.password || !member.nickname) {
        throw new Error(`Invalid member in ${family.familyCode}: username/password/nickname required.`);
      }
      if (role !== 'parent' && role !== 'child') {
        throw new Error(`Invalid role ${member.role} in ${family.familyCode}.`);
      }
    }
    const familyDays = family.days > 0 ? family.days : fixture.days;
    if (family.createdDaysAgo < familyDays) {
      throw new Error(
        `Family ${family.familyCode} createdDaysAgo (${family.createdDaysAgo}) must be >= days (${familyDays}).`
      );
    }
  }
}

function toDateOnly(dateValue) {
  return dateValue.toISOString().slice(0, 10);
}

function dateOffset(baseDate, deltaDays) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + deltaDays);
  return d;
}

function stateFromRate(rate) {
  if (rate <= 40) return 'withered';
  if (rate <= 80) return 'sicked';
  return 'healthy';
}

function statusFor(profile, dayIndex, questIndex) {
  const highPattern = ['complete', 'complete', 'submitted', 'complete', 'assigned', 'complete', 'incomplete'];
  const lowPattern = ['incomplete', 'assigned', 'submitted', 'incomplete', 'assigned', 'complete', 'incomplete'];
  const pattern = profile === 'high' ? highPattern : lowPattern;
  return pattern[(dayIndex + questIndex) % pattern.length];
}

function buildQuestMessage(status, questName, crystals) {
  if (status === 'complete') {
    return {
      type: 'crystal_earn',
      amount: crystals,
      title: 'Quest Completed',
      message: `You earned ${crystals} crystals from "${questName}".`
    };
  }
  if (status === 'incomplete') {
    return {
      type: 'quest_failed',
      amount: 0,
      title: 'Quest Failed',
      message: `Your quest "${questName}" was marked incomplete.`
    };
  }
  return null;
}

async function ensureFamily(connection, family, familyCreatedAt) {
  const [rows] = await connection.query(
    'SELECT id FROM families WHERE family_code = ? LIMIT 1',
    [family.familyCode]
  );
  if (rows.length) {
    await connection.query(
      'UPDATE families SET name = ?, created_at = ? WHERE id = ?',
      [family.name, familyCreatedAt, rows[0].id]
    );
    return rows[0].id;
  }
  const id = crypto.randomUUID();
  await connection.query(
    'INSERT INTO families (id, name, family_code, created_at) VALUES (?, ?, ?, ?)',
    [id, family.name, family.familyCode, familyCreatedAt]
  );
  return id;
}

async function cleanupFamilyData(connection, familyId) {
  const [userRows] = await connection.query('SELECT id FROM users WHERE family_id = ?', [familyId]);
  const userIds = userRows.map((r) => r.id);

  if (userIds.length) {
    const placeholders = userIds.map(() => '?').join(',');
    await connection.query(`DELETE FROM user_login_events WHERE user_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM sessions WHERE user_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM mailbox_messages WHERE user_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM crystal_ledger WHERE user_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM child_backpack_items WHERE child_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM reward_child_assignments WHERE child_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM daily_quests WHERE child_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM child_spirit_tree_daily WHERE child_id IN (${placeholders})`, userIds);
    await connection.query(`DELETE FROM child_spirit_tree WHERE child_id IN (${placeholders})`, userIds);
  }

  await connection.query('DELETE FROM wishes WHERE family_id = ?', [familyId]);
  await connection.query('DELETE FROM quest_definitions WHERE family_id = ?', [familyId]);
  await connection.query('DELETE FROM rewards WHERE family_id = ?', [familyId]);
  await connection.query('DELETE FROM users WHERE family_id = ?', [familyId]);
}

async function insertMembers(connection, bcrypt, familyId, members, familyCreatedAt) {
  const inserted = [];
  for (let idx = 0; idx < members.length; idx += 1) {
    const member = members[idx];
    const role = (member.role || 'child').toLowerCase();
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(member.password, 10);
    const createdAt = new Date(familyCreatedAt);
    createdAt.setMinutes(createdAt.getMinutes() + (idx + 1) * 5);
    await connection.query(
      `INSERT INTO users
        (id, family_id, username, password_hash, nickname, role, is_admin, status, crystal_balance, is_initial_password, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        familyId,
        member.username,
        passwordHash,
        member.nickname,
        role,
        role === 'parent' ? 1 : 0,
        (member.status || 'active').toLowerCase() === 'disabled' ? 'disabled' : 'active',
        Number(member.crystalBalance || 0),
        Number(member.isInitialPassword || 0) ? 1 : 0,
        createdAt
      ]
    );
    inserted.push({
      id,
      username: member.username,
      nickname: member.nickname,
      role
    });
  }
  return inserted;
}

async function insertQuestDefinitions(connection, familyId, questDefs, familyCreatedAt) {
  const entries = [];
  for (let idx = 0; idx < questDefs.length; idx += 1) {
    const quest = questDefs[idx];
    const id = crypto.randomUUID();
    const category = (quest.category || 'others').toLowerCase();
    const status = (quest.status || 'active').toLowerCase() === 'archived' ? 'archived' : 'active';
    const baseCrystals = Math.max(1, Math.min(100, Number(quest.baseCrystals || 1)));
    const createdAt = new Date(familyCreatedAt);
    createdAt.setHours(createdAt.getHours() + 2 + idx);
    await connection.query(
      `INSERT INTO quest_definitions
        (id, family_id, name, description, base_crystals, category, icon, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        familyId,
        quest.name,
        quest.description || null,
        baseCrystals,
        category,
        quest.icon || null,
        status,
        createdAt
      ]
    );
    entries.push({
      id,
      name: quest.name,
      baseCrystals,
      category
    });
  }
  return entries;
}

async function insertRewards(connection, familyId, rewards, familyCreatedAt) {
  const entries = [];
  for (let idx = 0; idx < rewards.length; idx += 1) {
    const reward = rewards[idx];
    const id = crypto.randomUUID();
    const status = (reward.status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active';
    const price = Math.max(1, Number(reward.price || 1));
    const createdAt = new Date(familyCreatedAt);
    createdAt.setHours(createdAt.getHours() + 6 + idx);
    await connection.query(
      `INSERT INTO rewards
        (id, family_id, name, description, icon_key, price, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        familyId,
        reward.name,
        reward.description || 'Magic Gift',
        reward.iconKey || 'gift',
        price,
        status,
        createdAt
      ]
    );
    entries.push({
      id,
      name: reward.name,
      price
    });
  }
  return entries;
}

async function ensureLoginEventsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_login_events (
      id CHAR(36) NOT NULL,
      user_id CHAR(36) NOT NULL,
      family_id CHAR(36) NOT NULL,
      login_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      PRIMARY KEY (id),
      KEY idx_ule_login_at (login_at),
      KEY idx_ule_user_login_at (user_id, login_at),
      KEY idx_ule_family_login_at (family_id, login_at),
      CONSTRAINT fk_ule_user FOREIGN KEY (user_id) REFERENCES users(id),
      CONSTRAINT fk_ule_family FOREIGN KEY (family_id) REFERENCES families(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function seedLoginEvents(connection, users, days, today) {
  await ensureLoginEventsTable(connection);
  const totalDays = Math.max(1, Number(days) || 1);
  const startDate = dateOffset(today, -(totalDays - 1));
  let inserted = 0;

  function hashToUnitFloat(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967295;
  }

  function getBaseRate(profile) {
    if (profile === 'high') return 0.52;
    if (profile === 'medium') return 0.38;
    return 0.24;
  }

  function getDayFactor(dayDate) {
    const weekday = dayDate.getDay(); // 0 Sunday .. 6 Saturday
    if (weekday === 0) return 0.88;
    if (weekday === 6) return 0.94;
    if (weekday === 1) return 0.98;
    if (weekday === 5) return 1.08;
    return 1;
  }

  function getUserAffinity(user) {
    return hashToUnitFloat(`affinity|${user.username}|${user.familyCode}`); // 0..1
  }

  function shouldFamilySkipDay(familyCode, dayDate) {
    const roll = hashToUnitFloat(`family-off|${familyCode}|${toDateOnly(dayDate)}`);
    return roll < 0.12; // about 12% days the whole family does not log in
  }

  function shouldLogin(user, dayDate) {
    const roleBonus = user.role === 'parent' ? 0.14 : 0;
    const affinity = getUserAffinity(user); // higher means more active user
    const affinityBonus = (affinity - 0.5) * 0.26;
    const dayFactor = getDayFactor(dayDate);
    const rawRate = (getBaseRate(user.familyProfile) + roleBonus + affinityBonus) * dayFactor;
    const rate = Math.max(0.04, Math.min(0.86, rawRate));
    const roll = hashToUnitFloat(`user-day|${user.username}|${toDateOnly(dayDate)}|${user.familyCode}`);
    return roll < rate;
  }

  for (let dayIdx = 0; dayIdx < totalDays; dayIdx += 1) {
    const dayDate = dateOffset(startDate, dayIdx);
    const familiesSkipped = new Set();

    for (let i = 0; i < users.length; i += 1) {
      const code = users[i].familyCode;
      if (familiesSkipped.has(code)) continue;
      if (shouldFamilySkipDay(code, dayDate)) {
        familiesSkipped.add(code);
      }
    }

    for (let userIdx = 0; userIdx < users.length; userIdx += 1) {
      const user = users[userIdx];
      if (familiesSkipped.has(user.familyCode)) {
        continue;
      }
      const shouldCreate = shouldLogin(user, dayDate);
      if (!shouldCreate) continue;

      const sessionTime = new Date(dayDate);
      sessionTime.setHours(8 + (userIdx % 4), 10 + userIdx, 0, 0);
      await connection.query(
        `INSERT INTO user_login_events (id, user_id, family_id, login_at, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          user.id,
          user.familyId,
          sessionTime
          ,
          sessionTime
        ]
      );
      inserted += 1;
    }
  }
  return inserted;
}

async function seedChildData(connection, context) {
  const {
    familyId,
    familyProfile,
    parentId,
    child,
    questDefinitions,
    rewards,
    days,
    today
  } = context;

  let runningBalance = 0;
  const startDate = dateOffset(today, -(days - 1));
  const activeQuestDefs = questDefinitions.slice(0, Math.min(4, questDefinitions.length));

  for (let dayIdx = 0; dayIdx < days; dayIdx += 1) {
    const targetDate = dateOffset(startDate, dayIdx);
    const targetDateText = toDateOnly(targetDate);
    let completeCount = 0;

    for (let qIdx = 0; qIdx < activeQuestDefs.length; qIdx += 1) {
      const questDef = activeQuestDefs[qIdx];
      const status = statusFor(familyProfile, dayIdx, qIdx);
      if (!QUEST_STATUSES.includes(status)) {
        continue;
      }

      const dailyQuestId = crypto.randomUUID();
      await connection.query(
        `INSERT INTO daily_quests
          (id, child_id, quest_definition_id, target_date, status, assigned_by)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [dailyQuestId, child.id, questDef.id, targetDateText, status, parentId]
      );

      if (status === 'complete') {
        completeCount += 1;
        runningBalance += questDef.baseCrystals;
        await connection.query(
          `INSERT INTO crystal_ledger (id, user_id, amount, type, source_id, created_at)
           VALUES (?, ?, ?, 'quest_reward', ?, ?)`,
          [crypto.randomUUID(), child.id, questDef.baseCrystals, dailyQuestId, targetDate]
        );
      }

      const message = buildQuestMessage(status, questDef.name, questDef.baseCrystals);
      if (message) {
        await connection.query(
          `INSERT INTO mailbox_messages
            (id, user_id, type, amount, source_id, title, message, is_read, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
          [
            crypto.randomUUID(),
            child.id,
            message.type,
            message.amount,
            dailyQuestId,
            message.title,
            message.message,
            targetDate
          ]
        );
      }
    }

    const completionRate = Math.round((completeCount / activeQuestDefs.length) * 100);
    const state = stateFromRate(completionRate);

    await connection.query(
      `INSERT INTO child_spirit_tree_daily
        (child_id, family_id, snapshot_date, state, completion_rate, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [child.id, familyId, targetDateText, state, completionRate, targetDate, targetDate]
    );
  }

  const yesterdayDate = dateOffset(new Date(), -1);
  const yesterdayText = toDateOnly(yesterdayDate);
  const [yesterdayRows] = await connection.query(
    `SELECT state, completion_rate
       FROM child_spirit_tree_daily
      WHERE child_id = ? AND snapshot_date = ?
      LIMIT 1`,
    [child.id, yesterdayText]
  );
  const latestState = yesterdayRows[0]?.state || 'withered';
  const latestRate = Number(yesterdayRows[0]?.completion_rate || 0);

  await connection.query(
    `INSERT INTO child_spirit_tree
      (child_id, family_id, state, completion_rate, source_date, last_calculated_at)
      VALUES (?, ?, ?, ?, ?, NOW())`,
    [child.id, familyId, latestState, latestRate, yesterdayText]
  );

  const chosenRewards = rewards.slice(0, Math.min(3, rewards.length));
  for (let i = 0; i < chosenRewards.length; i += 1) {
    const reward = chosenRewards[i];
    const quantity = familyProfile === 'high' ? (i + 1) * 2 : i + 1;
    await connection.query(
      `INSERT INTO reward_child_assignments (id, reward_id, child_id, quantity)
       VALUES (?, ?, ?, ?)`,
      [crypto.randomUUID(), reward.id, child.id, quantity]
    );

    await connection.query(
      `INSERT INTO child_backpack_items (id, child_id, reward_id, quantity)
       VALUES (?, ?, ?, ?)`,
      [crypto.randomUUID(), child.id, reward.id, Math.max(1, quantity - 1)]
    );
  }

  for (let i = 0; i < SLOT_CODES.length; i += 1) {
    const slotCode = SLOT_CODES[i];
    const reward = rewards[i % rewards.length];
    const isOpen = familyProfile === 'high' ? i < 3 : i < 2;
    const status = isOpen ? 'open' : 'accepted';
    const createdAt = dateOffset(new Date(), -(SLOT_CODES.length - i));
    await connection.query(
      `INSERT INTO wishes
        (id, child_id, family_id, reward_id, slot_code, status, created_at, accepted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        crypto.randomUUID(),
        child.id,
        familyId,
        reward.id,
        slotCode,
        status,
        createdAt,
        status === 'accepted' ? createdAt : null
      ]
    );
  }

  const purchaseReward = rewards[0];
  if (purchaseReward && runningBalance >= purchaseReward.price) {
    runningBalance -= purchaseReward.price;
    await connection.query(
      `INSERT INTO crystal_ledger (id, user_id, amount, type, source_id, created_at)
       VALUES (?, ?, ?, 'purchase', ?, NOW())`,
      [crypto.randomUUID(), child.id, -purchaseReward.price, purchaseReward.id]
    );
    await connection.query(
      `INSERT INTO mailbox_messages
        (id, user_id, type, amount, source_id, title, message, is_read, created_at)
       VALUES (?, ?, 'crystal_spend', ?, ?, 'Reward Purchased', ?, 0, NOW())`,
      [
        crypto.randomUUID(),
        child.id,
        purchaseReward.price,
        purchaseReward.id,
        `You spent ${purchaseReward.price} crystals on "${purchaseReward.name}".`
      ]
    );
  }

  await connection.query(
    'UPDATE users SET crystal_balance = ? WHERE id = ?',
    [runningBalance, child.id]
  );

  return {
    dailyQuestRows: days * activeQuestDefs.length,
    wishesRows: SLOT_CODES.length
  };
}

async function run({ connection, args, deps }) {
  const bcrypt = deps && deps.bcrypt;
  if (!bcrypt) {
    throw new Error('Missing bcrypt dependency.');
  }

  const options = parseOptions(args);
  if (!fs.existsSync(options.filePath)) {
    throw new Error(`XML file not found: ${options.filePath}`);
  }

  const xmlText = fs.readFileSync(options.filePath, 'utf8');
  const fixture = parseFixture(xmlText);
  if (options.days) fixture.days = options.days;
  validateFixture(fixture);

  let familyCount = 0;
  let userCount = 0;
  let questRows = 0;
  let wishRows = 0;
  let loginEventRows = 0;
  const today = new Date();

  await connection.beginTransaction();
  try {
    await ensureLoginEventsTable(connection);
    for (const family of fixture.families) {
      const familyDays = family.days > 0 ? family.days : fixture.days;
      const familyCreatedAt = dateOffset(today, -family.createdDaysAgo);
      familyCreatedAt.setHours(9, 0, 0, 0);

      const familyId = await ensureFamily(connection, family, familyCreatedAt);
      await cleanupFamilyData(connection, familyId);

      const members = await insertMembers(connection, bcrypt, familyId, family.members, familyCreatedAt);
      const membersWithFamily = members.map((m) => ({
        ...m,
        familyId,
        familyCode: family.familyCode,
        familyProfile: family.profile
      }));
      userCount += members.length;
      familyCount += 1;

      const parents = members.filter((m) => m.role === 'parent');
      const children = members.filter((m) => m.role === 'child');
      if (!parents.length || !children.length) {
        throw new Error(`Family ${family.familyCode} must include at least 1 parent and 1 child.`);
      }

      const questDefs = await insertQuestDefinitions(connection, familyId, family.questDefinitions, familyCreatedAt);
      const rewards = await insertRewards(connection, familyId, family.rewards, familyCreatedAt);
      const assignedParent = parents[0].id;

      loginEventRows += await seedLoginEvents(connection, membersWithFamily, familyDays, today);

      for (const child of children) {
        const stats = await seedChildData(connection, {
          familyId,
          familyProfile: family.profile,
          parentId: assignedParent,
          child,
          questDefinitions: questDefs,
          rewards,
          days: familyDays,
          today
        });
        questRows += stats.dailyQuestRows;
        wishRows += stats.wishesRows;
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }

  console.log(`[seed-xml] Imported file: ${options.filePath}`);
  console.log(`[seed-xml] Families: ${familyCount}`);
  console.log(`[seed-xml] Users: ${userCount}`);
  console.log(`[seed-xml] Days per child: family-specific (fallback=${fixture.days})`);
  console.log(`[seed-xml] Daily quests generated: ${questRows}`);
  console.log(`[seed-xml] Wishes generated: ${wishRows}`);
  console.log(`[seed-xml] Login events generated: ${loginEventRows}`);
}

module.exports = { run };
