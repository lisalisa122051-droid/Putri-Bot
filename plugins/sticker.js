import { config } from '../config.js';
import { getUser } from '../lib/database.js';
import axios from 'axios';

export async function sticker(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user) {
    return sock.sendMessage(from, {
      text: '❌ *Kamu belum terdaftar!*\nKetik .register untuk mendaftar.'
    });
  }
  
  const isImage = msg.message?.imageMessage;
  const isVideo = msg.message?.videoMessage;
  
  if (!isImage && !isVideo) {
    return sock.sendMessage(from, {
      text: '❌ *Kirim gambar/video dengan caption .sticker*\natau reply gambar/video dengan .sticker'
    });
  }
  
  await sock.sendMessage(from, {
    text: '🔄 *Membuat sticker...*'
  });
  
  try {
    // Download media
    let media;
    let mimetype;
    
    if (isImage) {
      media = await sock.downloadMediaMessage(msg);
      mimetype = 'image/jpeg';
    } else {
      media = await sock.downloadMediaMessage(msg);
      mimetype = 'video/mp4';
    }
    
    // Create sticker
    const stickerMessage = {
      sticker: Buffer.from(media),
      mimetype: mimetype
    };
    
    // Add pack and author if available
    if (msg.message?.extendedTextMessage?.text) {
      const text = msg.message.extendedTextMessage.text;
      const match = text.match(/pack:(.*?)\|author:(.*)/);
      if (match) {
        stickerMessage.contextInfo = {
          mentionedJid: [from]
        };
      }
    }
    
    await sock.sendMessage(from, stickerMessage);
    
    await sock.sendMessage(from, {
      text: `✅ *Sticker berhasil dibuat!*\n\n` +
            `Pack: Liviaa Bot\n` +
            `Author: ${user.lid}\n\n` +
            `_Gunakan .smeme untuk sticker dengan teks_`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal membuat sticker!*\n\nError: ${error.message}`
    });
  }
}

export async function smeme(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .smeme [teks atas]|[teks bawah]\nContoh: .smeme Hello|World'
    });
  }
  
  await sock.sendMessage(from, {
    text: '🎨 *Membuat sticker meme...*'
  });
  
  try {
    user.limit -= 1;
    
    const [top, bottom] = query.split('|');
    
    // Simulate meme creation
    const memeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(top || '')}/${encodeURIComponent(bottom || '')}.png?background=https://i.imgur.com/CXTXQ9Y.jpg`;
    
    const response = await axios.get(memeUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    await sock.sendMessage(from, {
      sticker: buffer,
      mimetype: 'image/png'
    });
    
    await sock.sendMessage(from, {
      text: `✅ *Sticker meme berhasil dibuat!*\n\n` +
            `Teks: ${top || ''} | ${bottom || ''}\n` +
            `Sisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal membuat meme!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}

export async function attp(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .attp [teks]\nContoh: .attp Hello World'
    });
  }
  
  try {
    user.limit -= 1;
    
    // Simulate ATTP (rainbow text sticker)
    const attpUrl = `https://api.xteam.xyz/attp?file&text=${encodeURIComponent(query)}`;
    
    const response = await axios.get(attpUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    await sock.sendMessage(from, {
      sticker: buffer,
      mimetype: 'image/gif'
    });
    
    await sock.sendMessage(from, {
      text: `🌈 *ATTP Sticker dibuat!*\n\n` +
            `Teks: ${query}\n` +
            `Sisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Gagal membuat ATTP!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}
