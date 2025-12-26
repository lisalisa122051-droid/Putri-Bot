import { config } from '../config.js';
import { getUser } from '../lib/database.js';
import axios from 'axios';

export async function ai(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .ai [pertanyaan]\nContoh: .ai Apa itu kecerdasan buatan?'
    });
  }
  
  await sock.sendMessage(from, {
    text: '🤖 *Sedang berpikir...*'
  });
  
  try {
    user.limit -= 1;
    
    // Simulate AI response (replace with actual API call)
    const responses = [
      `Berdasarkan pemahaman saya: ${query} adalah topik yang menarik. AI membantu manusia dalam banyak hal.`,
      `Pertanyaan bagus! ${query} membahas tentang perkembangan teknologi saat ini.`,
      `Sebagai AI, saya bisa menjelaskan bahwa ${query} adalah bagian dari kemajuan digital.`,
      `Tentang ${query}: Ini menunjukkan bagaimana teknologi semakin canggih.`
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    await sock.sendMessage(from, {
      text: `🧠 *${config.botName} AI*\n\n` +
            `Pertanyaan: ${query}\n\n` +
            `Jawaban: ${response}\n\n` +
            `Sisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *AI error!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}

export async function gpt(sock, from, lid, args, query, msg) {
  return ai(sock, from, lid, args, query, msg);
}

export async function translate(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  const text = args.slice(1).join(' ');
  if (!text) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .translate [teks]\nContoh: .translate Hello world'
    });
  }
  
  try {
    user.limit -= 1;
    
    // Simulate translation (replace with actual API)
    const translations = {
      'hello': 'halo',
      'world': 'dunia',
      'good morning': 'selamat pagi',
      'thank you': 'terima kasih',
      'i love you': 'aku sayang kamu'
    };
    
    let translated = text.toLowerCase();
    for (const [en, id] of Object.entries(translations)) {
      translated = translated.replace(new RegExp(en, 'gi'), id);
    }
    
    await sock.sendMessage(from, {
      text: `🌐 *TRANSLATE*\n\n` +
            `Original: ${text}\n` +
            `Translation: ${translated}\n\n` +
            `Sisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Translate error!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}

export async function tts(sock, from, lid, args, query, msg) {
  const user = getUser(lid);
  if (!user || user.limit < 1) {
    return sock.sendMessage(from, {
      text: '❌ *Limit habis!*\n\nGunakan .claim untuk mendapatkan limit harian.'
    });
  }
  
  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ *Format salah!*\nGunakan: .tts [teks]\nContoh: .tts Halo semuanya'
    });
  }
  
  try {
    user.limit -= 1;
    
    // Simulate TTS (replace with actual API)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(query)}&tl=id&client=tw-ob`;
    
    await sock.sendMessage(from, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mpeg',
      ptt: true
    });
    
    await sock.sendMessage(from, {
      text: `🔊 *Text-to-Speech*\n\n` +
            `Teks: ${query}\n` +
            `Sisa limit: ${user.limit}`
    });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *TTS error!*\n\nError: ${error.message}\nLimit dikembalikan.`
    });
    user.limit += 1;
  }
}
