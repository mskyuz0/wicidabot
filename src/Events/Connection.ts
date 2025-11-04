import {
    DisconnectReason,
} from "baileys";
import * as QRCode from "qrcode";
import { Boom } from "@hapi/boom";

module.exports = {
    name: 'connection.update',
    async execute(WhatsAppClient: any, connectToWhatsApp: any, update: any) {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("[SYSTEM] Please Scan QRCode for below to login:");
            // QRCode.generate(qr, { small: true })
            console.log(await QRCode.toString(qr, {type: 'terminal', small: true, margin: 0, scale: 1}))
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error instanceof Boom && (lastDisconnect.error as Boom).output?.statusCode !== DisconnectReason.loggedOut;

            console.log("[SYSTEM] Connection closed due to", lastDisconnect?.error);

            if (shouldReconnect) {
                console.log("[SYSTEM] Reconnecting...");
                await new Promise((res) => setTimeout(res, 2000));
                connectToWhatsApp();
            } else {
                console.log("Logged out. Delete session folder if needed.");
            }
        } else if (connection === 'open') {
            console.log('[SYSTEM] WhatsApp Bot Connected!');
        }
    }
}