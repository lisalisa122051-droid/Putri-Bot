import { getLid } from './utils.js';
import { getGroupSettings } from './database.js';

export async function handleParticipantUpdate(sock, update) {
  try {
    const { id, participants, action } = update;
    
    const settings = getGroupSettings(id);
    if (!settings.welcome) return;
    
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    
    for (const participant of participants) {
      const lid = getLid(participant);
      
      if (action === 'add') {
        await sock.sendMessage(id, {
          text: `🌸 *Selamat Datang!* 🌸\n\n@${lid} bergabung ke grup *${groupName}*\n\nSemoga betah yaa~`,
          mentions: [participant]
        });
      } else if (action === 'remove') {
        await sock.sendMessage(id, {
          text: `🍂 *Sampai Jumpa!* 🍂\n\n@${lid} telah meninggalkan grup\n\nSemoga sehat selalu~`,
          mentions: [participant]
        });
      }
    }
  } catch (error) {
    console.error('Welcome error:', error);
  }
}

export function setWelcome(jid, status) {
  const settings = getGroupSettings(jid);
  settings.welcome = status === 'on';
  return status === 'on';
}
