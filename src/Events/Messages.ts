const activeChats = new Map()

module.exports = {
    name: 'messages.upsert',
    async execute(WhatsAppClient: any, connectToWhatsApp: any, res: any) {
        const message = res.messages[0];
        const isMsg = message.message

        if (!isMsg || message.key.fromMe) return;

        const sender = message.key.remoteJid;

        if (!sender) return;

        const type = Object.keys(isMsg)[0]
        const textMessage = isMsg.conversation || isMsg.extendedTextMessage?.text
        const isCommand = textMessage?.toLocaleLowerCase()

        if (activeChats.has(sender)) {
            const session = activeChats.get(sender)

            if (isCommand === "menu1") {
                await WhatsAppClient.sendMessage(sender, {text: "ini menu1"});
                clearTimeout(session.timeout);
                activeChats.delete(sender);
                return;
            }

            if (isCommand === "menu2") {
                await WhatsAppClient.sendMessage(sender, {text: "ini menu2"});
                clearTimeout(session.timeout);
                activeChats.delete(sender);
                return;
            }

            await WhatsAppClient.sendMessage(sender, {text: 'Silahkan pilih salah satu menu yang tersedia.'});
            return;
        }

        await WhatsAppClient.sendMessage(sender, {
            text: 'Halo! 👋 Selamat datang di layanan kami.\nSilakan pilih menu di bawah ini:',
        });

        const timeout = setTimeout(async () => {
            await WhatsAppClient.sendMessage(sender, {
                text: '⏰ Waktu habis! Percakapan telah berakhir. Jika ingin mulai lagi, kirim pesan baru ya!',
            });
            activeChats.delete(sender);
        }, 5 * 60 * 1000); // 5 menit

        activeChats.set(sender, { timeout });
    }
}