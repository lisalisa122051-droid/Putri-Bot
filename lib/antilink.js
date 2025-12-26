import { getLid, isAdmin } from './utils.js';
import { getGroupSettings, updateGroupSettings } from './database.js';

const linkPatterns = [
  /chat\.whatsapp\.com/,
  /whatsapp\.com/,
  /wa\.me\/?[0-9]/,
  /wa\.link\/[a-z0-9]/,
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
];

export async function handleMessage(sock, msg) {
  try {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const lid = getLid(sender);
    
    // Only check in groups
    if (!from.endsWith('@g.us')) return;
    
    // Get group settings
    const settings = getGroupSettings(from);
    if (!settings.antiLink) return;
    
    // Check if sender is admin
    const isSenderAdmin = await isAdmin(sock, from, lid);
    if (isSenderAdmin) return;
    
    // Get message text
    let text = '';
    if (msg.message?.conversation) {
      text = msg.message.conversation;
    } else if (msg.message?.extendedTextMessage?.text) {
      text = msg.message.extendedTextMessage.text;
    }
    
    // Check for links
    const hasLink = linkPatterns.some(pattern => pattern.test(text));
    
    if (hasLink) {
      // Delete message
      await sock.sendMessage(from, {
        delete: msg.key
      });
      
      // Warn user
      await sock.sendMessage(from, {
        text: `⚠️ *Link Terdeteksi!*\n@${lid}\nTidak boleh mengirim link di grup ini!`,
        mentions: [sender]
      });
    }
  } catch (error) {
    console.error('Anti-link error:', error);
  }
}

export function setAntiLink(jid, status) {
  updateGroupSettings(jid, { antiLink: status === 'on' });
  return status === 'on';
}
