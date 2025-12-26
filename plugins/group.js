import { config } from '../config.js';
import { getLid, isAdmin, isOwner } from '../lib/utils.js';
import { getGroupSettings, updateGroupSettings } from '../lib/database.js';
import { setWelcome } from '../lib/welcome.js';
import { setAntiLink } from '../lib/antilink.js';
import { setAntiDelete } from '../lib/antidelete.js';
import { setSafeMode } from '../lib/safemode.js';

export async function group(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  const action = args[1]?.toLowerCase();
  
  if (!action || !['open', 'close'].includes(action)) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .group [open/close]'
    });
  }
  
  try {
    await sock.groupSettingUpdate(from, action === 'open' ? 'not_announcement' : 'announcement');
    
    await sock.sendMessage(from, {
      text: `✅ *Group ${action === 'open' ? 'dibuka' : 'ditutup'}!*\n\n` +
            `Sekarang semua member ${action === 'open' ? 'bisa' : 'tidak bisa'} mengirim pesan.`
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal!*\n\nError: ${error.message}`
    });
  }
}

export async function linkgroup(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  try {
    const inviteCode = await sock.groupInviteCode(from);
    const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
    
    await sock.sendMessage(from, {
      text: `🔗 *Link Group*\n\n${inviteLink}\n\n` +
            `_Link ini bisa digunakan untuk mengundang member baru._`
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal mendapatkan link!*\n\nPastikan bot adalah admin.`
    });
  }
}

export async function revoke(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  try {
    await sock.groupRevokeInvite(from);
    const newInviteCode = await sock.groupInviteCode(from);
    const newLink = `https://chat.whatsapp.com/${newInviteCode}`;
    
    await sock.sendMessage(from, {
      text: `🔄 *Link berhasil direset!*\n\nLink baru: ${newLink}\n\n` +
            `_Link sebelumnya sudah tidak berlaku._`
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal reset link!*\n\nError: ${error.message}`
    });
  }
}

export async function tagall(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  try {
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;
    const mentions = participants.map(p => p.id);
    
    const message = query || 'Hai semuanya!';
    
    await sock.sendMessage(from, {
      text: `🏷️ *Tag All Members*\n\n${message}\n\n` +
            `_Total: ${participants.length} members_`,
      mentions
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal tag all!*\n\nError: ${error.message}`
    });
  }
}

export async function kick(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  if (!msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nTag user yang ingin dikick\nContoh: .kick @user'
    });
  }
  
  const mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
  
  try {
    await sock.groupParticipantsUpdate(from, mentioned, 'remove');
    
    await sock.sendMessage(from, {
      text: `✅ *User dikeluarkan!*\n\nTotal: ${mentioned.length} user`,
      mentions: mentioned
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal kick user!*\n\nError: ${error.message}`
    });
  }
}

export async function promote(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  if (!msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nTag user yang ingin dipromote\nContoh: .promote @user'
    });
  }
  
  const mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
  
  try {
    await sock.groupParticipantsUpdate(from, mentioned, 'promote');
    
    await sock.sendMessage(from, {
      text: `👑 *User dipromote menjadi admin!*`,
      mentions: mentioned
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal promote user!*\n\nError: ${error.message}`
    });
  }
}

export async function demote(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  if (!msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nTag admin yang ingin diturunkan\nContoh: .demote @user'
    });
  }
  
  const mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
  
  try {
    await sock.groupParticipantsUpdate(from, mentioned, 'demote');
    
    await sock.sendMessage(from, {
      text: `⬇️ *User diturunkan dari admin!*`,
      mentions: mentioned
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal demote user!*\n\nError: ${error.message}`
    });
  }
}

export async function welcome(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  const status = args[1]?.toLowerCase();
  
  if (!status || !['on', 'off'].includes(status)) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .welcome [on/off]'
    });
  }
  
  const result = setWelcome(from, status);
  
  await sock.sendMessage(from, {
    text: `✅ *Welcome message ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*`
  });
}

export async function antilink(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  const status = args[1]?.toLowerCase();
  
  if (!status || !['on', 'off'].includes(status)) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .antilink [on/off]'
    });
  }
  
  const result = setAntiLink(from, status);
  
  await sock.sendMessage(from, {
    text: `✅ *Anti-link ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*\n\n` +
          `Bot akan ${status === 'on' ? 'menghapus' : 'membiarkan'} pesan yang mengandung link.`
  });
}

export async function antidelete(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  const status = args[1]?.toLowerCase();
  
  if (!status || !['on', 'off'].includes(status)) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .antidelete [on/off]'
    });
  }
  
  const result = setAntiDelete(from, status);
  
  await sock.sendMessage(from, {
    text: `✅ *Anti-delete ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*\n\n` +
          `Bot akan ${status === 'on' ? 'mendeteksi' : 'mengabaikan'} pesan yang dihapus.`
  });
}

export async function safemode(sock, from, lid, args, query, msg) {
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk grup!' });
  }
  
  const isUserAdmin = await isAdmin(sock, from, lid);
  if (!isUserAdmin && !isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Hanya admin yang bisa menggunakan command ini!' });
  }
  
  const status = args[1]?.toLowerCase();
  
  if (!status || !['on', 'off'].includes(status)) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .safemode [on/off]'
    });
  }
  
  const result = setSafeMode(from, status);
  
  await sock.sendMessage(from, {
    text: `✅ *Safe mode ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*\n\n` +
          `Pada safe mode, hanya command tertentu yang bisa digunakan.`
  });
}
