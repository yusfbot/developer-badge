const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({limit: '50mb'}));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const BOT_TOKEN = 'MTEwMjAwODY3NDMxMjAxMTgwNg.GawOsZ.vQYaD2Z5qxNHimtSlwVU_4KJi3zJyfIEBBKBIM';
const CHANNEL_ID = '1212498683824709674'; // Replace with your channel ID where the image will be sent

client.login(BOT_TOKEN);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Make sure 'index.html' is in the correct directory relative to this file
});

app.post('/save-and-send-screenshot', async (req, res) => {
    const screenshotData = req.body.screenshotData.replace(/^data:image\/png;base64,/, "");
    const imagePath = path.join(__dirname, 'screenshot.png');
    fs.writeFileSync(imagePath, screenshotData, 'base64');

    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        await channel.send({files: [imagePath]});
        console.log('Screenshot sent to Discord channel successfully.');
        res.json({message: 'Screenshot uploaded and sent to Discord channel successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Failed to upload and send screenshot to Discord channel.'});
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));