import { config } from '../config.js';
import { getUser } from '../lib/database.js';
import axios from 'axios';

export async function ytmp3(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .ytmp3 [url YouTube]\nContoh: .ytmp3 https://youtube.com/watch?v=xxx'
    });
  }
  
  await sock.sendMessage(from, {
    text: '📥 *Mengunduh audio...*\n\nMohon tunggu beberapa saat.'
  });
  
  try {
    // Update user limit
    user.limit -= 1;
    
    // Simulate download (replace with actual API)
    const audioUrl = `https://example.com/download?url=${encodeURIComponent(query)}&format=mp3`;
    
    await sock.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: 'audio.mp3'
    });
    
    await sock.sendMessage(from, {
      text: `✅ *Download berhasil!*\n\nSisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Download gagal!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}

export async function ytmp4(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .ytmp4 [url YouTube]\nContoh: .ytmp4 https://youtube.com/watch?v=xxx'
    });
  }
  
  await sock.sendMessage(from, {
    text: '📥 *Mengunduh video...*\n\nMohon tunggu beberapa saat.'
  });
  
  try {
    user.limit -= 1;
    
    const videoUrl = `https://example.com/download?url=${encodeURIComponent(query)}&format=mp4`;
    
    await sock.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: 'video.mp4'
    });
    
    await sock.sendMessage(from, {
      text: `✅ *Download berhasil!*\n\nSisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Download gagal!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}

export async function tiktok(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .tiktok [url TikTok]\nContoh: .tiktok https://tiktok.com/@user/video/xxx'
    });
  }
  
  await sock.sendMessage(from, {
    text: '📥 *Mengunduh TikTok...*\n\nMohon tunggu beberapa saat.'
  });
  
  try {
    user.limit -= 1;
    
    // Simulate TikTok download API
    const response = await axios.get(`https://api.tiklydown.me/api/download?url=${encodeURIComponent(query)}`);
    const data = response.data;
    
    if (data.video) {
      await sock.sendMessage(from, {
        video: { url: data.video.noWatermark },
        caption: `🎵 *TikTok Download*\n\n👤 Author: ${data.author.nickname}\n❤️ Likes: ${data.stats.likes}\n📥 Download berhasil!`
      });
    } else {
      throw new Error('Video not found');
    }
    
    await sock.sendMessage(from, {
      text: `✅ *Download berhasil!*\n\nSisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Download gagal!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}

export async function instagram(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .instagram [url IG]\nContoh: .instagram https://instagram.com/p/xxx'
    });
  }
  
  await sock.sendMessage(from, {
    text: '📥 *Mengunduh Instagram...*\n\nMohon tunggu beberapa saat.'
  });
  
  try {
    user.limit -= 1;
    
    // Simulate Instagram download
    const mediaUrl = `https://example.com/ig?url=${encodeURIComponent(query)}`;
    
    await sock.sendMessage(from, {
      image: { url: mediaUrl },
      caption: '📸 *Instagram Download*'
    });
    
    await sock.sendMessage(from, {
      text: `✅ *Download berhasil!*\n\nSisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Download gagal!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}

export async function play(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .play [judul lagu]\nContoh: .play Shape of You'
    });
  }
  
  await sock.sendMessage(from, {
    text: `🔍 *Mencari: ${query}...*`
  });
  
  try {
    user.limit -= 1;
    
    // Simulate search
    const results = [
      { title: `${query} - Artist 1`, url: 'https://example.com/audio1.mp3' },
      { title: `${query} - Artist 2`, url: 'https://example.com/audio2.mp3' },
      { title: `${query} - Artist 3`, url: 'https://example.com/audio3.mp3' }
    ];
    
    const buttons = [
      {
        buttonId: `.play1 ${query}`,
        buttonText: { displayText: '🎵 Pilihan 1' },
        type: 1
      },
      {
        buttonId: `.play2 ${query}`,
        buttonText: { displayText: '🎵 Pilihan 2' },
        type: 1
      },
      {
        buttonId: `.play3 ${query}`,
        buttonText: { displayText: '🎵 Pilihan 3' },
        type: 1
      }
    ];
    
    await sock.sendMessage(from, {
      text: `🎶 *Hasil Pencarian:*\n\n1. ${results[0].title}\n2. ${results[1].title}\n3. ${results[2].title}\n\nPilih salah satu:`,
      buttons,
      headerType: 1
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Pencarian gagal!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}
