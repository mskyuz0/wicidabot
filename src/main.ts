import {
    makeWASocket,
    useMultiFileAuthState,
} from "baileys";
import * as P from "pino";
import * as fs from "fs";
import * as path from 'node:path'

async function connectToWhatsApp() {
    // ! Auth
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const WhatsAppClient = makeWASocket({
        auth: state,
        logger: P.pino({ level: 'silent' }),
    });

    // ! Events Handling
    const eventFolder = path.join(__dirname, 'Events');
    const eventFiles = fs.readdirSync(eventFolder).filter(f => f.endsWith('.js'));

    for (const file of eventFiles) {
        const thisFile = path.join(eventFolder, file);
        const event = require(thisFile);

        WhatsAppClient.ev.on(event.name, (...args) => event.execute(WhatsAppClient, connectToWhatsApp, ...args));
    }

    // ! Credentials
    WhatsAppClient.ev.on("creds.update", saveCreds);
}

connectToWhatsApp();