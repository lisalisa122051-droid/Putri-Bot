import { config } from '../config.js';

// Convert JID to LID (Logical ID)
export function getLid(jid) {
  if (!jid) return null;
  return jid.replace(/[^0-9]/g, '').replace(/^620?/, '62');
}

// Check if user is owner
export function isOwner(lid) {
  return lid === config.ownerLid;
}

// Check if is group
export function isGroup(jid) {
  return jid.endsWith('@g.us');
}

// Check if user is admin in group
export async function isAdmin(sock, jid, lid) {
  if (!isGroup(jid)) return false;
  
  try {
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;
    const user = participants.find(p => getLid(p.id) === lid);
    
    return user && (user.admin === 'admin' || user.admin === 'superadmin');
  } catch {
    return false;
  }
}

// Format number
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format time
export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (secs > 0) parts.push(`${secs} detik`);
  
  return parts.join(' ') || '0 detik';
}

// Random choice
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Validate URL
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Delay function
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Sanitize text
export function sanitize(text) {
  return text
    .replace(/[`*_~|<>]/g, '\\$&')
    .replace(/@(\d+)/g, '@$1');
}

// Generate random string
export function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
