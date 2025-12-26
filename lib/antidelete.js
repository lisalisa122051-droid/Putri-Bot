import { getLid, isAdmin } from './utils.js';
import { getGroupSettings } from './database.js';

export async function handleMessageDelete(sock, deletions) {
  try {
    for (const deletion of deletions.keys) {
      const { remoteJid: jid, fromMe } = deletion;
      
      // Skip if deleted by bot
      if (fromMe) continue;
      
      // Only process groups
      if (!jid.endsWith('@g.us')) continue;
      
      const settings = getGroupSettings(jid);
      if (!settings.antiDelete) continue;
      
      // Get deleted message info
      const message = deletions.messages?.[0];
      if (!message) continue;
      
      const sender = deletion.participant || jid;
      const lid = getLid(sender);
      
      // Check if sender is admin
      const isSenderAdmin = await isAdmin(sock, jid, lid);
      if (isSenderAdmin) continue;
      
      // Get message text
      let text = '';
      if (message.message?.conversation) {
        text = message.message.conversation;
      } else if (message.message?.extendedTextMessage?.text) {
        text = message.message.extendedTextMessage.text;
      }
      
      if (text) {
        await sock.sendMessage(jid, {
          text: `⚠️ *Pesan Dihapus Terdeteksi!*\n\n@${lid} menghapus pesan:\n"${text.slice(0, 200)}${text.length > 200 ? '...' : ''}"`,
          mentions: [sender]
        });
      }
    }
  } catch (error) {
    console.error('Anti-delete error:', error);
  }
}

export function setAntiDelete(jid, status) {
  const settings = getGroupSettings(jid);
  settings.antiDelete = status === 'on';
  return status === 'on';
}
