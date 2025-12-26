import makeWASocket from '@whiskeysockets/baileys';
import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { config } from './config.js';
import { handler } from './handler.js';
import { 
  loadDatabase, 
  saveDatabase, 
  addUser, 
  getUser 
} from './lib/database.js';
import { getLid, isOwner } from './lib/utils.js';

const logger = pino({ level: 'silent' });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionPath);
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger,
    browser: ['Liviaa Bot', 'Chrome', '3.0'],
    markOnlineOnConnect: true
  });
  
  // Load database
  global.db = await loadDatabase();
  
  // Store sock globally
  global.sock = sock;
  
  // Handle connection updates
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('Scan QR code:');
      qrcode.generate(qr, { small: true });
    }
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(startBot, 5000);
      }
    } else if (connection === 'open') {
      console.log(`${config.botName} connected!`);
      console.log(`Owner: ${config.ownerLid}`);
      console.log(`Prefix: ${config.prefix}`);
    }
  });
  
  // Save credentials
  sock.ev.on('creds.update', saveCreds);
  
  // Handle messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    
    try {
      await handler(sock, msg);
    } catch (error) {
      console.error('Handler error:', error);
    }
  });
  
  // Handle group participants update
  sock.ev.on('group-participants.update', async (update) => {
    const welcomeModule = await import('./lib/welcome.js');
    welcomeModule.handleParticipantUpdate(sock, update);
  });
  
  // Handle message deletions
  sock.ev.on('messages.delete', async (deletions) => {
    const antideleteModule = await import('./lib/antidelete.js');
    antideleteModule.handleMessageDelete(sock, deletions);
  });
  
  // Anti-link module
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const antilinkModule = await import('./lib/antilink.js');
    antilinkModule.handleMessage(sock, messages[0]);
  });
}

// Start bot
startBot().catch(console.error);

// Handle process exit
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await saveDatabase(global.db);
  process.exit(0);
});
