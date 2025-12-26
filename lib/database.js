import fs from 'fs-extra';
import { config } from '../config.js';

let database = {
  users: {},
  groups: {},
  settings: {
    antiLink: {},
    welcome: {},
    safeMode: {},
    antiDelete: {}
  },
  stats: {
    commands: 0,
    messages: 0,
    users: 0
  }
};

// Load database
export async function loadDatabase() {
  try {
    if (await fs.pathExists(config.databasePath)) {
      const data = await fs.readJson(config.databasePath);
      database = { ...database, ...data };
    }
    return database;
  } catch (error) {
    console.error('Error loading database:', error);
    return database;
  }
}

// Save database
export async function saveDatabase(db = database) {
  try {
    await fs.writeJson(config.databasePath, db, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
}

// User functions
export function addUser(lid, data = {}) {
  if (!database.users[lid]) {
    database.users[lid] = {
      lid,
      registered: new Date().toISOString(),
      limit: 25,
      exp: 0,
      level: 1,
      lastClaim: null,
      ...data
    };
    database.stats.users = Object.keys(database.users).length;
    return true;
  }
  return false;
}

export function getUser(lid) {
  return database.users[lid];
}

export function updateUser(lid, data) {
  if (database.users[lid]) {
    database.users[lid] = { ...database.users[lid], ...data };
    return true;
  }
  return false;
}

export function removeUser(lid) {
  if (database.users[lid]) {
    delete database.users[lid];
    database.stats.users = Object.keys(database.users).length;
    return true;
  }
  return false;
}

// Group functions
export function getGroupSettings(jid) {
  if (!database.settings[jid]) {
    database.settings[jid] = {
      antiLink: false,
      welcome: true,
      safeMode: false,
      antiDelete: false,
      antiSpam: false,
      antiForeign: false
    };
  }
  return database.settings[jid];
}

export function updateGroupSettings(jid, settings) {
  database.settings[jid] = { ...database.settings[jid], ...settings };
  return true;
}

// Stats functions
export function incrementStats(type) {
  if (database.stats[type] !== undefined) {
    database.stats[type]++;
    return true;
  }
  return false;
}

// Get all users
export function getAllUsers() {
  return Object.values(database.users);
}

// Get top users by exp
export function getTopUsers(limit = 10) {
  return getAllUsers()
    .sort((a, b) => b.exp - a.exp)
    .slice(0, limit);
}

// Backup database
export async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `./backup/database-${timestamp}.json`;
  
  try {
    await fs.ensureDir('./backup');
    await fs.copy(config.databasePath, backupPath);
    return backupPath;
  } catch (error) {
    console.error('Backup error:', error);
    return null;
  }
}
