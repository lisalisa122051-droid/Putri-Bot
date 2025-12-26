import { config } from './config.js';
import { getLid, isOwner, isGroup } from './lib/utils.js';
import { getUser } from './lib/database.js';

export async function handler(sock, msg) {
  try {
    const from = msg.key.remoteJid;
    const messageType = Object.keys(msg.message)[0];
    const isCmd = msg.message?.conversation?.startsWith(config.prefix) || 
                  msg.message?.extendedTextMessage?.text?.startsWith(config.prefix);
    
    if (!isCmd) return;
    
    // Get message content
    let body = '';
    if (messageType === 'conversation') {
      body = msg.message.conversation;
    } else if (messageType === 'extendedTextMessage') {
      body = msg.message.extendedTextMessage.text;
    }
    
    if (!body.startsWith(config.prefix)) return;
    
    // Parse command
    const args = body.trim().split(/\s+/);
    const command = args[0].toLowerCase().slice(config.prefix.length);
    const query = args.slice(1).join(' ');
    
    // Get sender info
    const sender = msg.key.participant || from;
    const lid = getLid(sender);
    
    // Check maintenance
    if (config.maintenance && !isOwner(lid)) {
      return sock.sendMessage(from, { 
        text: '🌷 *Bot sedang dalam perbaikan*\nMohon tunggu beberapa saat...' 
      });
    }
    
    // Register user if not exists
    if (!getUser(lid)) {
      await (await import('./plugins/user.js')).registerUser(sock, from, lid);
    }
    
    // Load plugins based on command category
    const plugins = {
      // Main
      'menu': './plugins/menu.js',
      'allmenu': './plugins/menu.js',
      'help': './plugins/menu.js',
      'ping': './plugins/main.js',
      'runtime': './plugins/main.js',
      'infobot': './plugins/main.js',
      'speed': './plugins/main.js',
      'status': './plugins/main.js',
      
      // Owner
      'self': './plugins/owner.js',
      'public': './plugins/owner.js',
      'setppbot': './plugins/owner.js',
      'setnamebot': './plugins/owner.js',
      'setbio': './plugins/owner.js',
      'restart': './plugins/owner.js',
      'shutdown': './plugins/owner.js',
      'bc': './plugins/owner.js',
      'join': './plugins/owner.js',
      'leave': './plugins/owner.js',
      'block': './plugins/owner.js',
      'unblock': './plugins/owner.js',
      'clearchat': './plugins/owner.js',
      'backup': './plugins/owner.js',
      'getcase': './plugins/owner.js',
      'addowner': './plugins/owner.js',
      'delowner': './plugins/owner.js',
      
      // Group
      'group': './plugins/group.js',
      'linkgroup': './plugins/group.js',
      'revoke': './plugins/group.js',
      'setnamegc': './plugins/group.js',
      'setdesc': './plugins/group.js',
      'setppgc': './plugins/group.js',
      'hidetag': './plugins/group.js',
      'tagall': './plugins/group.js',
      'kick': './plugins/group.js',
      'add': './plugins/group.js',
      'promote': './plugins/group.js',
      'demote': './plugins/group.js',
      'resetlink': './plugins/group.js',
      'welcome': './plugins/group.js',
      'antilink': './plugins/group.js',
      'antiviewonce': './plugins/group.js',
      'antidelete': './plugins/group.js',
      'safemode': './plugins/group.js',
      
      // Anti
      'antilinkall': './plugins/anti.js',
      'antibot': './plugins/anti.js',
      'antispam': './plugins/anti.js',
      'antivirtex': './plugins/anti.js',
      'antitoxic': './plugins/anti.js',
      'antiforeign': './plugins/anti.js',
      'detect': './plugins/anti.js',
      
      // Download
      'ytmp3': './plugins/download.js',
      'ytmp4': './plugins/download.js',
      'play': './plugins/download.js',
      'tiktok': './plugins/download.js',
      'tiktokmp3': './plugins/download.js',
      'instagram': './plugins/download.js',
      'facebook': './plugins/download.js',
      'mediafire': './plugins/download.js',
      'twitter': './plugins/download.js',
      
      // Fun
      'jodoh': './plugins/fun.js',
      'jadian': './plugins/fun.js',
      'rate': './plugins/fun.js',
      'truth': './plugins/fun.js',
      'dare': './plugins/fun.js',
      'cekganteng': './plugins/fun.js',
      'cekcantik': './plugins/fun.js',
      'bucin': './plugins/fun.js',
      'pantun': './plugins/fun.js',
      'tebakgambar': './plugins/fun.js',
      'tebaklagu': './plugins/fun.js',
      'tebakkata': './plugins/fun.js',
      
      // AI
      'ai': './plugins/ai.js',
      'gpt': './plugins/ai.js',
      'translate': './plugins/ai.js',
      'tts': './plugins/ai.js',
      'toimg': './plugins/ai.js',
      'tomp3': './plugins/ai.js',
      'removebg': './plugins/ai.js',
      'qc': './plugins/ai.js',
      'nulis': './plugins/ai.js',
      
      // Sticker
      'sticker': './plugins/sticker.js',
      'smeme': './plugins/sticker.js',
      'take': './plugins/sticker.js',
      'emojimix': './plugins/sticker.js',
      'attp': './plugins/sticker.js',
      'ttp': './plugins/sticker.js',
      
      // User
      'register': './plugins/user.js',
      'unregister': './plugins/user.js',
      'ceksn': './plugins/user.js',
      'profile': './plugins/user.js',
      'limit': './plugins/user.js',
      'claim': './plugins/user.js',
      'leaderboard': './plugins/user.js',
      
      // Info
      'owner': './plugins/info.js',
      'rules': './plugins/info.js',
      'donasi': './plugins/info.js',
      'script': './plugins/info.js',
      'changelog': './plugins/info.js',
      'about': './plugins/info.js'
    };
    
    if (plugins[command]) {
      const module = await import(plugins[command]);
      if (module[command] || module.default) {
        const func = module[command] || module.default;
        await func(sock, from, lid, args, query, msg);
      }
    } else {
      // Unknown command
      await sock.sendMessage(from, {
        text: `❓ *Command tidak ditemukan*\nKetik *.menu* untuk melihat daftar command`
      });
    }
    
  } catch (error) {
    console.error('Handler error:', error);
  }
}
