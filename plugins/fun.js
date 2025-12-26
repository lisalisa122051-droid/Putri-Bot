import { config } from '../config.js';
import { randomChoice } from '../lib/utils.js';

const loveQuotes = [
  "Kamu adalah alasan aku tersenyum setiap hari 💕",
  "Cinta sejati tidak butuh waktu lama untuk dikenali, hanya butuh satu detik untuk dirasakan 🌹",
  "Jika aku bisa memilih satu orang untuk selamanya, itu pasti kamu 🦋",
  "Cintaku padamu tak terukur, tak terbatas, dan tak pernah berakhir 🌷",
  "Kamu bukan hanya pacarku, tapi juga sahabat dan rumahku 🏡"
];

const pantun = [
  "Jalan-jalan ke kota Bogor\nJangan lupa bawa payung\nKalau kamu jadi bintang film\nAku rela jadi paparazzi",
  "Makan bakso di sore hari\nBaksonya panas hati senang\nWalau jauh di mata\nTapi dekat di hati",
  "Pergi ke pasar beli terong\nTerongnya hijau segar sekali\nJangan lupa makan yang teratur\nAgar badan tetap sehat selalu",
  "Naik motor ke Bandung\nJatuh di tengah jalan\nKalau cinta sudah melekat\nSusahlah untuk dilupakan"
];

const truthQuestions = [
  "Apa rahasia terbesar yang belum pernah kamu ceritakan?",
  "Pernahkah kamu mencuri sesuatu?",
  "Siapa crush pertama kamu?",
  "Pernahkah kamu berbohong kepada orang tua?",
  "Apa momen paling memalukan dalam hidupmu?"
];

const dareChallenges = [
  "Kirim pesan 'Aku sayang kamu' ke kontak pertama di daftar telepon",
  "Ganti foto profil WA dengan foto lucu selama 1 jam",
  "Telfon teman dan menyanyikan lagu selamat ulang tahun",
  "Posting status dengan kata-kata random selama 24 jam",
  "Kirim voice note menyanyikan lagu kesukaan"
];

export async function jodoh(sock, from, lid, args, query, msg) {
  const target = query || 'Kamu';
  const names = ['Aisha', 'Budi', 'Citra', 'Dito', 'Eka', 'Fajar', 'Gita', 'Hadi'];
  const jodoh = randomChoice(names);
  const percentage = Math.floor(Math.random() * 100) + 1;
  
  const compatibility = [
    "Sangat tidak cocok 😔",
    "Kurang cocok 🤔",
    "Cukup cocok 😊",
    "Sangat cocok 😍",
    "Pasangan soulmate 💖"
  ][Math.floor(percentage / 20)];
  
  await sock.sendMessage(from, {
    text: `💘 *Ramalan Jodoh* 💘\n\n` +
          `Nama: ${target}\n` +
          `Jodoh: ${jodoh}\n` +
          `Kecocokan: ${percentage}%\n` +
          `Status: ${compatibility}\n\n` +
          `_Hasil ini hanya untuk hiburan semata_`
  });
}

export async function rate(sock, from, lid, args, query, msg) {
  const target = query || 'Kamu';
  const rating = Math.floor(Math.random() * 10) + 1;
  const stars = '⭐'.repeat(rating);
  
  const comments = [
    "Butuh banyak improvement 😅",
    "Lumayan lah ya 😊",
    "Cukup baik 👍",
    "Sangat bagus! 😍",
    "Sempurna! 🌟"
  ][Math.floor(rating / 2) - 1];
  
  await sock.sendMessage(from, {
    text: `⭐ *Rating Meter* ⭐\n\n` +
          `Target: ${target}\n` +
          `Rating: ${rating}/10\n` +
          `${stars}\n` +
          `Komentar: ${comments}\n\n` +
          `_Disclaimer: Hasil ini random_`
  });
}

export async function truth(sock, from, lid, args, query, msg) {
  const question = randomChoice(truthQuestions);
  
  await sock.sendMessage(from, {
    text: `❓ *TRUTH QUESTION* ❓\n\n` +
          `${question}\n\n` +
          `Jawab dengan jujur ya! 😊`
  });
}

export async function dare(sock, from, lid, args, query, msg) {
  const challenge = randomChoice(dareChallenges);
  
  await sock.sendMessage(from, {
    text: `😈 *DARE CHALLENGE* 😈\n\n` +
          `${challenge}\n\n` +
          `Lakukan tantangan ini! 🎯`
  });
}

export async function cekganteng(sock, from, lid, args, query, msg) {
  const target = query || 'Kamu';
  const level = Math.floor(Math.random() * 100) + 1;
  
  let status = '';
  if (level >= 90) status = 'GANTENG BANGET! 😍';
  else if (level >= 70) status = 'Ganteng sih 😊';
  else if (level >= 50) status = 'Lumayan lah 😅';
  else if (level >= 30) status = 'Biasa aja 😐';
  else status = 'Yaahh... 😔';
  
  await sock.sendMessage(from, {
    text: `🕵️ *Cek Kegantengan* 🕵️\n\n` +
          `Nama: ${target}\n` +
          `Tingkat Kegantengan: ${level}%\n` +
          `Status: ${status}\n\n` +
          `_Hasil ini tidak mempengaruhi realita_`
  });
}

export async function bucin(sock, from, lid, args, query, msg) {
  const quote = randomChoice(loveQuotes);
  
  await sock.sendMessage(from, {
    text: `💖 *BUCIN QUOTES* 💖\n\n` +
          `${quote}\n\n` +
          `_Jangan kebanyakan bucin ya!_`
  });
}

export async function pantun(sock, from, lid, args, query, msg) {
  const pantunText = randomChoice(pantun);
  
  await sock.sendMessage(from, {
    text: `📜 *PANTUN* 📜\n\n` +
          `${pantunText}\n\n` +
          `_Selamat menikmati!_`
  });
}
