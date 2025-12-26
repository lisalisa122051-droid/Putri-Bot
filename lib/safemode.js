import { getGroupSettings, updateGroupSettings } from './database.js';

const safeCommands = ['menu', 'help', 'ping', 'owner', 'rules', 'donasi', 'about'];

export function isSafeMode(jid) {
  const settings = getGroupSettings(jid);
  return settings.safeMode || false;
}

export function setSafeMode(jid, status) {
  updateGroupSettings(jid, { safeMode: status === 'on' });
  return status === 'on';
}

export function checkSafeMode(jid, command) {
  if (!isSafeMode(jid)) return true;
  
  // If safe mode is on, only allow safe commands
  return safeCommands.includes(command.toLowerCase());
}

export function getSafeModeMessage(jid, command) {
  if (!isSafeMode(jid)) return null;
  
  if (!checkSafeMode(jid, command)) {
    return `❌ *Safe Mode Aktif*\nCommand *.${command}* tidak dapat digunakan saat safe mode aktif.\nKontak admin untuk menonaktifkan safe mode.`;
  }
  
  return null;
}
