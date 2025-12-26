import { config } from '../config.js';
import { getLid, isOwner } from '../lib/utils.js';

export async function menu(sock, from, lid, args, query, msg) {
  try {
    const ownerStatus = isOwner(lid) ? '👑 Owner' : '👤 User';
    
    // Main menu with List Message
    const menuText = `🦋 *${config.botName} Bot Menu* 🦋\n\n` +
      `👋 Halo, ${ownerStatus}!\n` +
      `🕐 ${new Date().toLocaleString('id-ID')}\n\n` +
      `*Total Fitur:* 58 commands\n` +
      `*Prefix:* ${config.prefix}\n\n` +
      `Pilih kategori menu di bawah:`;
    
    const sections = [
      {
        title: "📌 MAIN MENU",
        rows: [
          { title: "📋 Semua Menu", rowId: ".allmenu" },
          { title: "🏓 Ping Bot", rowId: ".ping" },
          { title: "⚡ Speed Test", rowId: ".speed" },
          { title: "📊 Bot Status", rowId: ".status" }
        ]
      },
      {
        title: "👤 OWNER MENU",
        rows: [
          { title: "🤖 Mode Self", rowId: ".self" },
          { title: "📢 Broadcast", rowId: ".bc" },
          { title: "🔄 Restart Bot", rowId: ".restart" }
        ]
      },
      {
        title: "👥 GROUP MENU",
        rows: [
          { title: "🔗 Link Group", rowId: ".linkgroup" },
          { title: "🏷️ Tag All", rowId: ".tagall" },
          { title: "🎉 Welcome", rowId: ".welcome on" }
        ]
      },
      {
        title: "🎮 FUN MENU",
        rows: [
          { title: "💞 Cek Jodoh", rowId: ".jodoh" },
          { title: "⭐ Rate", rowId: ".rate" },
          { title: "💬 Truth/Dare", rowId: ".truth" }
        ]
      },
      {
        title: "📥 DOWNLOAD MENU",
        rows: [
          { title: "🎵 YouTube MP3", rowId: ".ytmp3" },
          { title: "🎬 TikTok", rowId: ".tiktok" },
          { title: "📸 Instagram", rowId: ".instagram" }
        ]
      }
    ];
    
    const listMessage = {
      text: menuText,
      footer: "🌷 Liviaa Chantika Bot • Built with Baileys",
      title: "✨ Pilih Menu",
      buttonText: "Buka Menu",
      sections
    };
    
    await sock.sendMessage(from, listMessage);
    
  } catch (error) {
    console.error('Menu error:', error);
    // Fallback text menu
    const fallbackMenu = `
🦋 *${config.botName} Bot Menu* 🦋

📌 *MAIN*
• .menu - Menu interaktif
• .ping - Cek kecepatan
• .status - Status bot
• .infobot - Info bot

👤 *OWNER* ${isOwner(lid) ? '(Aktif)' : ''}
• .bc - Broadcast pesan
• .join - Join grup
• .leave - Keluar grup
• .restart - Restart bot

👥 *GROUP*
• .linkgroup - Dapatkan link
• .tagall - Tag semua member
• .kick - Keluarkan member
• .promote - Jadikan admin

📥 *DOWNLOAD*
• .ytmp3 [url] - YouTube to MP3
• .tiktok [url] - Download TikTok
• .instagram [url] - Download IG

🎮 *FUN*
• .jodoh [nama] - Cek jodoh
• .rate [target] - Rating
• .truth - Truth question
• .dare - Dare challenge

🧠 *AI & TOOLS*
• .ai [pertanyaan] - AI chat
• .sticker - Buat sticker
• .translate [teks] - Terjemahkan

ℹ️ *INFO*
• .owner - Info owner
• .donasi - Support bot
• .rules - Peraturan

🌷 *Total: 58 commands*
📝 *Ketik .allmenu untuk semua command*`;
    
    await sock.sendMessage(from, { text: fallbackMenu });
  }
}

export async function allmenu(sock, from, lid, args, query, msg) {
  const fullMenu = `
🦋 *${config.botName} - All Commands* 🦋

📌 *MAIN MENU*
• .menu / .help - Menu interaktif
• .ping - Cek latency bot
• .runtime - Waktu aktif bot
• .infobot - Informasi bot
• .speed - Speed test
• .status - Status server

👤 *OWNER MENU* ${isOwner(lid) ? '✅' : '❌'}
• .self - Mode private
• .public - Mode public
• .setppbot - Set foto bot
• .setnamebot - Set nama bot
• .setbio - Set bio bot
• .restart - Restart bot
• .shutdown - Matikan bot
• .bc [teks] - Broadcast
• .join [link] - Join grup
• .leave - Keluar grup
• .block [nomor] - Blokir user
• .unblock [nomor] - Buka blokir
• .clearchat - Bersihkan chat
• .backup - Backup database
• .getcase - Lihat kasus
• .addowner [nomor] - Tambah owner
• .delowner [nomor] - Hapus owner

👥 *GROUP MENU*
• .group [open/close] - Buka/tutup grup
• .linkgroup - Dapatkan link
• .revoke - Reset link grup
• .setnamegc [nama] - Ganti nama grup
• .setdesc [deskripsi] - Ganti deskripsi
• .setppgc - Set foto grup
• .hidetag [teks] - Tag tersembunyi
• .tagall - Tag semua member
• .kick @tag - Keluarkan member
• .add [nomor] - Tambah member
• .promote @tag - Jadikan admin
• .demote @tag - Turunkan admin
• .resetlink - Reset link grup
• .welcome [on/off] - Welcome message
• .antilink [on/off] - Anti link
• .antiviewonce [on/off] - Anti viewonce
• .antidelete [on/off] - Anti delete
• .safemode [on/off] - Safe mode

🛡️ *ANTI & SECURITY*
• .antilinkall [on/off] - Anti semua link
• .antibot [on/off] - Anti bot
• .antispam [on/off] - Anti spam
• .antivirtex [on/off] - Anti virtex
• .antitoxic [on/off] - Anti toxic
• .antiforeign [on/off] - Anti asing
• .detect [on/off] - Deteksi fitur

📥 *DOWNLOAD MENU*
• .ytmp3 [url] - YouTube to MP3
• .ytmp4 [url] - YouTube to MP4
• .play [judul] - Play music
• .tiktok [url] - Download TikTok
• .tiktokmp3 [url] - TikTok audio
• .instagram [url] - Download IG
• .facebook [url] - Download FB
• .mediafire [url] - MediaFire
• .twitter [url] - Download Twitter

🎮 *FUN MENU*
• .jodoh [nama] - Cek jodoh
• .jadian [nama] - Cek kecocokan
• .rate [target] - Beri rating
• .truth - Truth question
• .dare - Dare challenge
• .cekganteng [nama] - Cek kegantengan
• .cekcantik [nama] - Cek kecantikan
• .bucin - Quotes bucin
• .pantun - Pantun random
• .tebakgambar - Game tebak gambar
• .tebaklagu - Game tebak lagu
• .tebakkata - Game tebak kata

🧠 *AI & TOOLS*
• .ai [pertanyaan] - AI chat
• .gpt [prompt] - ChatGPT
• .translate [teks] - Terjemahkan
• .tts [teks] - Text to speech
• .toimg - Sticker to image
• .tomp3 - Video to MP3
• .removebg - Hapus background
• .qc [teks] - Quote creator
• .nulis [teks] - Tulisan tangan

🖼️ *STICKER MENU*
• .sticker - Buat sticker
• .smeme [teks] - Sticker meme
• .take [author] - Take sticker
• .emojimix [emoji] - Mix emoji
• .attp [teks] - Rainbow text
• .ttp [teks] - Stylish text

🗂️ *USER & DATABASE*
• .register - Daftar user
• .unregister - Hapus data
• .ceksn - Cek serial number
• .profile - Profile user
• .limit - Cek limit
• .claim - Klaim harian
• .leaderboard - Ranking user

ℹ️ *INFO MENU*
• .owner - Info owner
• .rules - Peraturan bot
• .donasi - Support bot
• .script - Source code
• .changelog - Update log
• .about - Tentang bot

🌷 *Total: 58 Commands*
📞 *Owner: ${config.ownerLid}*
🦋 *Built with @whiskeysockets/baileys*`;
  
  await sock.sendMessage(from, { text: fullMenu });
}

export async function help(sock, from, lid, args, query, msg) {
  return menu(sock, from, lid, args, query, msg);
}
