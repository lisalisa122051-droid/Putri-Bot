import { config } from '../config.js';
import { formatTime } from '../lib/utils.js';
import { incrementStats } from '../lib/database.js';

const startTime = Date.now();

export async function ping(sock, from, lid, args, query, msg) {
  incrementStats('commands');
  
  const timestamp = Date.now();
  const latency = timestamp - (msg.messageTimestamp * 1000);
  
  await sock.sendMessage(from, {
    text: `🏓 *Pong!*\n\n` +
          `⚡ Latency: ${latency}ms\n` +
          `🕐 Server: ${new Date().toLocaleTimeString('id-ID')}\n` +
          `🌐 Status: Online`
  });
}

export async function runtime(sock, from, lid, args, query, msg) {
  const uptime = Date.now() - startTime;
  
  await sock.sendMessage(from, {
    text: `⏰ *Runtime Info*\n\n` +
          `🕐 Aktif selama: ${formatTime(uptime)}\n` +
          `📅 Start: ${new Date(startTime).toLocaleString('id-ID')}\n` +
          `⏱️ Now: ${new Date().toLocaleString('id-ID')}`
  });
}

export async function infobot(sock, from, lid, args, query, msg) {
  const os = require('os');
  
  await sock.sendMessage(from, {
    text: `🤖 *${config.botName} Information*\n\n` +
          `🌸 *Name:* ${config.botName}\n` +
          `👑 *Owner:* ${config.ownerLid}\n` +
          `🎯 *Prefix:* ${config.prefix}\n` +
          `⚡ *Library:* Baileys v6.6.0\n` +
          `📅 *Created:* 2024\n\n` +
          `🖥️ *System Info*\n` +
          `• Platform: ${os.platform()}\n` +
          `• Arch: ${os.arch()}\n` +
          `• CPU: ${os.cpus()[0].model}\n` +
          `• Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB\n\n` +
          `🌷 *"Simple but powerful bot"*`
  });
}

export async function speed(sock, from, lid, args, query, msg) {
  const start = Date.now();
  
  const testMessage = await sock.sendMessage(from, { 
    text: '🏃‍♂️ *Testing speed...*' 
  });
  
  const end = Date.now();
  const speed = end - start;
  
  await sock.sendMessage(from, {
    text: `⚡ *Speed Test Results*\n\n` +
          `📤 Upload: ${speed}ms\n` +
          `📥 Download: ${speed}ms\n` +
          `🌐 Ping: ${speed}ms\n\n` +
          `${speed < 500 ? '✅ Excellent' : speed < 1000 ? '⚠️ Good' : '❌ Slow'}`
  });
  
  // Delete testing message
  if (testMessage) {
    await sock.sendMessage(from, {
      delete: testMessage.key
    });
  }
}

export async function status(sock, from, lid, args, query, msg) {
  const os = require('os');
  const usedMemory = process.memoryUsage();
  
  const statusText = `📊 *Bot Status*\n\n` +
    `🤖 *Bot Info*\n` +
    `• Name: ${config.botName}\n` +
    `• Runtime: ${formatTime(Date.now() - startTime)}\n` +
    `• Commands: ${global.db?.stats?.commands || 0}\n` +
    `• Users: ${global.db?.stats?.users || 0}\n\n` +
    `🖥️ *Server Status*\n` +
    `• CPU: ${(os.loadavg()[0] * 100).toFixed(2)}%\n` +
    `• RAM: ${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)}/${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB\n` +
    `• Uptime: ${formatTime(os.uptime() * 1000)}\n\n` +
    `📈 *Process*\n` +
    `• Heap: ${(usedMemory.heapUsed / 1024 / 1024).toFixed(2)}MB\n` +
    `• RSS: ${(usedMemory.rss / 1024 / 1024).toFixed(2)}MB\n\n` +
    `🌷 *Status:* ${config.maintenance ? '🛑 Maintenance' : '✅ Online'}`;
  
  await sock.sendMessage(from, { text: statusText });
}
