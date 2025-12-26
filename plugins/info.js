import { config } from '../config.js';

export async function owner(sock, from, lid, args, query, msg) {
  const ownerInfo = `👑 *OWNER INFORMATION*\n\n` +
    `🌸 *Name:* Liviaa Chantika\n` +
    `📞 *Phone:* ${config.ownerLid}\n` +
    `🤖 *Bot Name:* ${config.botName}\n\n` +
    `📱 *Social Media*\n` +
    `Instagram: @liviaa.c\n` +
    `GitHub: LiviaaDev\n\n` +
    `💌 *Contact*\n` +
    `Untuk kerjasama/bantuan:\n` +
    `wa.me/${config.ownerLid.replace('+', '')}\n\n` +
    `🌷 _Terima kasih sudah menggunakan bot ini_`;
  
  await sock.sendMessage(from, { text: ownerInfo });
}

export async function rules(sock, from, lid, args, query, msg) {
  const rulesText = `📜 *RULES & PERATURAN*\n\n` +
    `1. 🚫 Dilarang spam command\n` +
    `2. 🚫 Dilarang mengirim konten NSFW\n` +
    `3. 🚫 Dilarang mengeksploitasi bug\n` +
    `4. ✅ Gunakan bot dengan bijak\n` +
    `5. ✅ Hormati pengguna lain\n` +
    `6. ✅ Laporkan bug ke owner\n\n` +
    `⚠️ *Konsekuensi:*\n` +
    `• Pelanggaran ringan: Peringatan\n` +
    `• Pelanggaran sedang: Blokir sementara\n` +
    `• Pelanggaran berat: Blokir permanen\n\n` +
    `📞 *Contact Owner:* ${config.ownerLid}`;
  
  await sock.sendMessage(from, { text: rulesText });
}

export async function donasi(sock, from, lid, args, query, msg) {
  const donationText = `💖 *DONASI & SUPPORT*\n\n` +
    `Bantu pengembangan bot dengan donasi:\n\n` +
    `📊 *Manfaat donasi:*\n` +
    `• Limit tambahan\n` +
    `• Fitur premium\n` +
    `• Priority support\n` +
    `• Bot lebih stabil\n\n` +
    `💰 *Payment Methods:*\n` +
    `• Dana: ${config.ownerLid}\n` +
    `• OVO: ${config.ownerLid}\n` +
    `• GoPay: ${config.ownerLid}\n` +
    `• QRIS: Tanyakan owner\n\n` +
    `📞 *Konfirmasi:*\n` +
    `Kirim bukti transfer ke owner\n` +
    `wa.me/${config.ownerLid.replace('+', '')}\n\n` +
    `🌷 _Terima kasih untuk supportnya_`;
  
  await sock.sendMessage(from, { text: donationText });
}

export async function about(sock, from, lid, args, query, msg) {
  const aboutText = `🌺 *TENTANG BOT*\n\n` +
    `🤖 *${config.botName}*\n` +
    `Versi: 2.0.0\n` +
    `Library: @whiskeysockets/baileys\n` +
    `Bahasa: Node.js\n\n` +
    `✨ *Fitur Utama:*\n` +
    `• 58+ commands\n` +
    `• Download media\n` +
    `• AI chat\n` +
    `• Sticker creator\n` +
    `• Game & fun\n` +
    `• Group management\n\n` +
    `👨‍💻 *Developer:*\n` +
    `Liviaa Chantika\n` +
    `${config.ownerLid}\n\n` +
    `📅 *Dibuat:* 2024\n` +
    `🎯 *Tujuan:* Memudahkan aktivitas WhatsApp\n\n` +
    `🌷 _Semoga bot ini bermanfaat_`;
  
  await sock.sendMessage(from, { text: aboutText });
}

export async function script(sock, from, lid, args, query, msg) {
  await sock.sendMessage(from, {
    text: `📦 *SOURCE CODE*\n\n` +
          `Script ini open source!\n\n` +
          `🌐 *GitHub:*\n` +
          `https://github.com/LiviaaDev/liviaa-bot\n\n` +
          `📚 *Teknologi:*\n` +
          `• Baileys WA Web\n` +
          `• Node.js\n` +
          `• JavaScript ES6\n\n` +
          `⚠️ *Disclaimer:*\n` +
          `Hanya untuk edukasi\n` +
          `Jangan disalahgunakan`
  });
}

export async function changelog(sock, from, lid, args, query, msg) {
  const changelogText = `📝 *CHANGELOG v2.0.0*\n\n` +
    `✨ *New Features:*\n` +
    `• Menu interaktif (List & Button)\n` +
    `• Database JSON sistem\n` +
    `• Limit & level system\n` +
    `• 58 commands aktif\n` +
    `• Anti-link & anti-delete\n` +
    `• Welcome message\n\n` +
    `🐛 *Fixes:*\n` +
    `• Perbaikan handler\n` +
    `• Optimasi memory\n` +
    `• Bug fixes\n\n` +
    `🔧 *Technical:*\n` +
    `• Modular structure\n` +
    `• LID-based validation\n` +
    `• Clean code\n\n` +
    `📅 *Updated:* ${new Date().toLocaleDateString('id-ID')}`;
  
  await sock.sendMessage(from, { text: changelogText });
}
