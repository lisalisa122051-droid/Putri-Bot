import { config } from '../config.js';
import { getLid } from '../lib/utils.js';
import { addUser, getUser, updateUser, getAllUsers, getTopUsers } from '../lib/database.js';

export async function registerUser(sock, from, lid) {
  const user = addUser(lid, {
    name: 'User',
    limit: 25,
    exp: 0,
    level: 1,
    registered: new Date().toISOString(),
    lastActive: new Date().toISOString()
  });
  
  if (user) {
    await sock.sendMessage(from, {
      text: `✅ *Pendaftaran berhasil!*\n\n` +
            `ID: ${lid}\n` +
            `Limit: 25\n` +
            `Level: 1\n\n` +
            `_Selamat menggunakan bot_`
    });
    return true;
  }
  return false;
}

export async function register(sock, from, lid, args, query, msg) {
  const existingUser = getUser(lid);
  
  if (existingUser) {
    return sock.sendMessage(from, {
      text: '❌ *Kamu sudah terdaftar!*\n\n' +
            `ID: ${lid}\n` +
            `Limit: ${existingUser.limit}\n` +
            `Level: ${existingUser.level}`
    });
  }
  
  return registerUser(sock, from, lid);
}

export async function profile(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  
  if (!user) {
    return registerUser(sock, from, lid);
  }
  
  const daysRegistered = Math.floor((new Date() - new Date(user.registered)) / (1000 * 60 * 60 * 24));
  
  await sock.sendMessage(from, {
    text: `📱 *USER PROFILE*\n\n` +
          `🆔 ID: ${lid}\n` +
          `📅 Terdaftar: ${daysRegistered} hari lalu\n` +
          `⭐ Level: ${user.level}\n` +
          `🎯 Exp: ${user.exp}\n` +
          `💎 Limit: ${user.limit}\n` +
          `📊 Rank: #${getAllUsers().sort((a,b) => b.exp - a.exp).findIndex(u => u.lid === lid) + 1}\n\n` +
          `_Gunakan .limit untuk info limit_`
  });
}

export async function limit(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  
  if (!user) {
    return registerUser(sock, from, lid);
  }
  
  const resetTime = new Date();
  resetTime.setHours(24, 0, 0, 0);
  const timeUntilReset = resetTime - new Date();
  const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
  
  await sock.sendMessage(from, {
    text: `💎 *LIMIT INFO*\n\n` +
          `Limit saat ini: ${user.limit}\n` +
          `Limit harian: 25\n` +
          `Reset dalam: ${hours} jam ${minutes} menit\n\n` +
          `📝 *Cara dapat limit:*\n` +
          `• .claim (harian)\n` +
          `• Aktif menggunakan bot\n` +
          `• Donasi (.donasi)`
  });
}

export async function claim(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  
  if (!user) {
    return registerUser(sock, from, lid);
  }
  
  const now = new Date();
  const lastClaim = user.lastClaim ? new Date(user.lastClaim) : null;
  
  if (lastClaim && now.getDate() === lastClaim.getDate() && now.getMonth() === lastClaim.getMonth() && now.getFullYear() === lastClaim.getFullYear()) {
    const nextClaim = new Date(lastClaim);
    nextClaim.setDate(nextClaim.getDate() + 1);
    nextClaim.setHours(0, 0, 0, 0);
    
    const timeUntilNext = nextClaim - now;
    const hours = Math.floor(timeUntilNext / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));
    
    return sock.sendMessage(from, {
      text: `❌ *Kamu sudah claim hari ini!*\n\n` +
            `Limit saat ini: ${user.limit}\n` +
            `Bisa claim lagi dalam: ${hours} jam ${minutes} menit`
    });
  }
  
  user.limit += 5;
  user.exp += 10;
  user.lastClaim = now.toISOString();
  
  // Level up check
  const expNeeded = user.level * 100;
  if (user.exp >= expNeeded) {
    user.level += 1;
    user.exp = user.exp - expNeeded;
    
    await sock.sendMessage(from, {
      text: `🎉 *LEVEL UP!*\n\n` +
            `🎯 Level baru: ${user.level}\n` +
            `⭐ Exp: ${user.exp}/${user.level * 100}\n` +
            `💎 Bonus limit: +5\n` +
            `🎁 Total limit: ${user.limit}`
    });
  } else {
    await sock.sendMessage(from, {
      text: `✅ *Claim berhasil!*\n\n` +
            `💎 +5 Limit\n` +
            `⭐ +10 Exp\n` +
            `📊 Total limit: ${user.limit}\n` +
            `🎯 Exp: ${user.exp}/${user.level * 100}\n` +
            `📅 Bisa claim lagi besok`
    });
  }
}

export async function leaderboard(sock, from, lid, args, query, msg) {
  const topUsers = getTopUsers(10);
  const currentUser = getUser(lid);
  const userRank = topUsers.findIndex(u => u.lid === lid) + 1;
  
  let leaderboardText = `🏆 *LEADERBOARD TOP 10*\n\n`;
  
  topUsers.forEach((user, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    leaderboardText += `${medal} ${user.lid}\n`;
    leaderboardText += `   Level: ${user.level} | Exp: ${user.exp} | Limit: ${user.limit}\n\n`;
  });
  
  if (currentUser && userRank > 10) {
    leaderboardText += `\n📊 *Posisi kamu:* #${userRank}\n`;
    leaderboardText += `Level: ${currentUser.level} | Exp: ${currentUser.exp} | Limit: ${currentUser.limit}`;
  }
  
  await sock.sendMessage(from, { text: leaderboardText });
}

export async function ceksn(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  
  if (!user) {
    return registerUser(sock, from, lid);
  }
  
  const sn = require('crypto').createHash('md5').update(lid).digest('hex').slice(0, 12).toUpperCase();
  
  await sock.sendMessage(from, {
    text: `🔑 *SERIAL NUMBER*\n\n` +
          `👤 ID: ${lid}\n` +
          `🔢 SN: ${sn}\n` +
          `📅 Generated: ${new Date().toLocaleDateString('id-ID')}\n\n` +
          `_Simpan SN untuk verifikasi_`
  });
}
