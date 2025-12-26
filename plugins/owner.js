import { config } from '../config.js';
import { getLid, isOwner } from '../lib/utils.js';
import { backupDatabase, addUser, updateUser } from '../lib/database.js';

export async function self(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  config.maintenance = true;
  await sock.sendMessage(from, {
    text: '🔒 *Mode Self Aktif*\n\nBot hanya merespon owner.'
  });
}

export async function public(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  config.maintenance = false;
  await sock.sendMessage(from, {
    text: '🔓 *Mode Public Aktif*\n\nBot merespon semua user.'
  });
}

export async function bc(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .bc [pesan]'
    });
  }
  
  const users = Object.keys(global.db.users);
  let success = 0;
  let failed = 0;
  
  await sock.sendMessage(from, {
    text: `📢 *Broadcast dimulai...*\n\nTarget: ${users.length} users`
  });
  
  for (const userLid of users) {
    try {
      await sock.sendMessage(`${userLid}@s.whatsapp.net`, {
        text: `📢 *Broadcast Message*\n\n${query}\n\n_~ ${config.botName}_`
      });
      success++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1s
    } catch (error) {
      failed++;
    }
  }
  
  await sock.sendMessage(from, {
    text: `✅ *Broadcast selesai!*\n\n` +
          `✅ Berhasil: ${success}\n` +
          `❌ Gagal: ${failed}\n` +
          `📊 Total: ${users.length} users`
  });
}

export async function restart(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  await sock.sendMessage(from, {
    text: '🔄 *Restarting bot...*\n\nMohon tunggu 5 detik.'
  });
  
  process.exit(0);
}

export async function join(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .join [link grup]'
    });
  }
  
  try {
    const groupCode = query.split('https://chat.whatsapp.com/')[1];
    const result = await sock.groupAcceptInvite(groupCode);
    
    await sock.sendMessage(from, {
      text: `✅ *Berhasil join grup!*\n\nGroup ID: ${result}`
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal join grup!*\n\nError: ${error.message}`
    });
  }
}

export async function leave(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  const groupId = from.endsWith('@g.us') ? from : null;
  if (!groupId && !query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan di grup atau: .leave [group jid]'
    });
  }
  
  const targetGroup = query || groupId;
  
  try {
    await sock.groupLeave(targetGroup);
    await sock.sendMessage(from, {
      text: `👋 *Berhasil keluar dari grup!*`
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal keluar grup!*\n\nError: ${error.message}`
    });
  }
}

export async function backup(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  const backupPath = await backupDatabase();
  
  if (backupPath) {
    await sock.sendMessage(from, {
      text: `✅ *Backup berhasil!*\n\nFile: ${backupPath}\nSize: ${require('fs').statSync(backupPath).size} bytes`
    });
  } else {
    await sock.sendMessage(from, {
      text: '❌ *Backup gagal!*'
    });
  }
}

export async function addowner(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .addowner [nomor]\nContoh: .addowner 6281234567890'
    });
  }
  
  const newOwnerLid = query.replace(/[^0-9]/g, '');
  
  if (!global.db.owners) global.db.owners = [config.ownerLid];
  
  if (global.db.owners.includes(newOwnerLid)) {
    return sock.sendMessage(from, {
      text: `❌ User ${newOwnerLid} sudah menjadi owner!`
    });
  }
  
  global.db.owners.push(newOwnerLid);
  addUser(newOwnerLid, { level: 999 });
  
  await sock.sendMessage(from, {
    text: `✅ *Owner ditambahkan!*\n\nNomor: ${newOwnerLid}\nTotal owners: ${global.db.owners.length}`
  });
}

export async function delowner(sock, from, lid, args, query, msg) {
  if (!isOwner(lid)) {
    return sock.sendMessage(from, { text: '❌ Command ini hanya untuk owner!' });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .delowner [nomor]\nContoh: .delowner 6281234567890'
    });
  }
  
  const targetLid = query.replace(/[^0-9]/g, '');
  
  if (targetLid === config.ownerLid) {
    return sock.sendMessage(from, {
      text: '❌ Tidak bisa menghapus owner utama!'
    });
  }
  
  if (!global.db.owners.includes(targetLid)) {
    return sock.sendMessage(from, {
      text: `❌ User ${targetLid} bukan owner!`
    });
  }
  
  global.db.owners = global.db.owners.filter(owner => owner !== targetLid);
  
  await sock.sendMessage(from, {
    text: `✅ *Owner dihapus!*\n\nNomor: ${targetLid}\nTotal owners: ${global.db.owners.length}`
  });
}
