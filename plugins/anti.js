import { config } from '../config.js';
import { getLid, isAdmin, isOwner } from '../lib/utils.js';
import { getGroupSettings, updateGroupSettings } from '../lib/database.js';

export async function antilinkall(sock, from, lid, args, query, msg) {
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
      text: '❌ *Format salah!*\nGunakan: .antilinkall [on/off]'
    });
  }
  
  const settings = getGroupSettings(from);
  settings.antiLinkAll = status === 'on';
  
  await sock.sendMessage(from, {
    text: `✅ *Anti-link all ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*\n\n` +
          `Bot akan ${status === 'on' ? 'memblokir semua jenis link' : 'membiarkan link'}.`
  });
}

export async function antibot(sock, from, lid, args, query, msg) {
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
      text: '❌ *Format salah!*\nGunakan: .antibot [on/off]'
    });
  }
  
  const settings = getGroupSettings(from);
  settings.antiBot = status === 'on';
  
  await sock.sendMessage(from, {
    text: `✅ *Anti-bot ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*\n\n` +
          `Bot akan ${status === 'on' ? 'mengeluarkan akun bot otomatis' : 'membiarkan bot'}.`
  });
}

export async function antispam(sock, from, lid, args, query, msg) {
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
      text: '❌ *Format salah!*\nGunakan: .antispam [on/off]'
    });
  }
  
  const settings = getGroupSettings(from);
  settings.antiSpam = status === 'on';
  
  await sock.sendMessage(from, {
    text: `✅ *Anti-spam ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*\n\n` +
          `Bot akan ${status === 'on' ? 'membatasi pesan spam' : 'membiarkan spam'}.`
  });
}

export async function detect(sock, from, lid, args, query, msg) {
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
      text: '❌ *Format salah!*\nGunakan: .detect [on/off]'
    });
  }
  
  const settings = getGroupSettings(from);
  settings.detect = status === 'on';
  
  await sock.sendMessage(from, {
    text: `✅ *Detect mode ${status === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!*\n\n` +
          `Bot akan ${status === 'on' ? 'mendeteksi aktivitas mencurigakan' : 'menonaktifkan deteksi'}.`
  });
}
