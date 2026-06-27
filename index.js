const fs = require('fs');
const path = require('path');
const express = require('express');

// Link loops logic execution pipelines directly to external automation modules
const startGroupTitleLoop = require('./task-grouptitle');
const startNicknameLoop = require('./task-nicknames');

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

const apiNeroPath = path.join(__dirname, 'API-Nero', 'index.js');
const login = require(apiNeroPath); 

// Setting a fixed, secured port for immediate deployment without prompts
const FIXED_CONTROL_PORT = 3090;
const DEDICATED_APP_USER = "Zed_System_Admin";

runMainBotSystem(DEDICATED_APP_USER, FIXED_CONTROL_PORT);

function runMainBotSystem(username, assignedPort) {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const userConfigFile = path.join(__dirname, 'config_secured_system.json');

    if (!fs.existsSync(userConfigFile)) {
        const defaultSettings = {
            groups: ["2587972468310614"], 
            groupTitle1: "👑 اسم الجروب الثابت المحمي 👑",
            name1: "🔥 كنية الأعضاء الموحدة 🔥",
            name2: "👑 كنيتك المخصوصة الفخمة 👑",
            messages: ["100000000000000"]
        };
        fs.writeFileSync(userConfigFile, JSON.stringify(defaultSettings, null, 2), 'utf8');
    }
    try { fs.writeFileSync('config.json', fs.readFileSync(userConfigFile)); } catch(e){}

    // 🌐 Web management panel configuration router (4 explicit input fields edition)
    app.get('/', (req, res) => {
        const config = JSON.parse(fs.readFileSync(userConfigFile, 'utf8'));
        const activeUserIdValue = config.messages && config.messages ? config.messages : "";
        
        let html = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>لوحة التحكم والسيطرة</title>';
        html += '<style>body { font-family: sans-serif; background: #0b0f19; color: #e2e8f0; padding: 25px; text-align: center; } .card { background: #111827; padding: 25px; border-radius: 12px; display: inline-block; text-align: right; width: 480px; border: 1px solid #1f2937; box-shadow: 0 4px 6px rgba(0,0,0,0.3); } input, textarea { width: 95%; padding: 12px; margin: 10px 0; background: #1f2937; color: #fff; border: 1px solid #374151; border-radius: 6px; font-size: 14px; } button { background: #00ea91; color: #000; padding: 14px; width: 100%; font-weight: bold; border-radius: 6px; cursor: pointer; border: none; margin-top: 15px; font-size: 15px; } button:hover { background: #00c479; } h2 { color: #00ea91; border-bottom: 1px solid #1f2937; padding-bottom: 10px; margin-top: 5px; text-align: center; } label { font-weight: bold; color: #9ca3af; font-size: 14px; }</style></head>';
        html += '<body><div class="card"><form action="/update" method="POST">';
        html += '<h2>🛡️ منظومة السيطرة وقفل كنيات الجروب الكبرى</h2>';
        html += '<p style="color: #6b7280; font-size: 12px; text-align: center; margin-bottom: 20px;">اللوحة مخصصة لفرض اسم الجروب وتثبيت كنية موحدة للجميع مع تخصيص كنية لك وحدك</p>';
        
        html += '<label>🎯 ضع معرف المجموعة المستهدفة (ID الجروب):</label><textarea name="groups" rows="1" style="color: #00ea91; font-weight: bold; font-family: monospace;">' + (config.groups ? config.groups.join('\n') : '') + '</textarea>';
        html += '<label>👑 اسم المجموعة الثابت الإجباري (الاسم المحمي):</label><input type="text" name="groupTitle1" value="' + (config.groupTitle1 || '') + '" style="color: #fff; font-weight: bold;">';
        html += '<label>👥 الكنية الثابتة الموحدة لجميع أعضاء الجروب:</label><input type="text" name="name1" value="' + (config.name1 || '') + '" style="color: #38bdf8; font-weight: bold;">';
        html += '<label>💎 ضع معرف حسابك الشخصي المستثنى (ID الخاص بك):</label><input type="text" name="messages" value="' + activeUserIdValue + '" style="color: #fbbf24; font-weight: bold; font-family: monospace;">';
        html += '<label>👑 اكتب كنيتك المخصوصة والفخمة لك وحدك:</label><input type="text" name="name2" value="' + (config.name2 || '') + '" style="color: #00ea91; font-weight: bold;">';
        
        html += '<button type="submit">💾 حفظ الإعدادات وتأمين الكنيات إجبارياً</button></form></div></body></html>';
        
        res.send(html);
    });

    app.post('/update', (req, res) => {
        const config = JSON.parse(fs.readFileSync(userConfigFile, 'utf8'));
        config.groups = req.body.groups.split('\n').map(g => g.trim()).filter(g => g.length > 0);
        config.groupTitle1 = req.body.groupTitle1;
        config.name1 = req.body.name1;
        config.name2 = req.body.name2;
        config.messages = [req.body.messages.trim()];
        
        fs.writeFileSync(userConfigFile, JSON.stringify(config, null, 2), 'utf8');
        try { fs.writeFileSync('config.json', JSON.stringify(config, null, 2), 'utf8'); } catch(e){}
        res.send('<h2>✅ تم حفظ الإعدادات وفرض الكنيات المزدوجة بنجاح!</h2><script>setTimeout(() => { window.location.href = "/"; }, 2000);</script>');
    });

    app.listen(assignedPort, '0.0.0.0', async () => {
        console.log(`\n🔗 [SYSTEM ROUTER ONLINE] Secure dashboard host activated on port: ${assignedPort}`);
        try {
            const localtunnel = require('localtunnel');
            const secureTunnel = await localtunnel({ port: assignedPort });
            console.log(`====================================================`);
            console.log(`👑 SYSTEM NICKNAME PROTECTION GATEWAY LIVE`);
            console.log(`👉 WORLDWIDE ACCESS LINK: ${secureTunnel.url}`);
            console.log(`====================================================\n`);
        } catch (tunnelError) {}
    });

    const targetAppStatePath = path.join(__dirname, 'appstate.json');
    const cleanAppState = JSON.parse(fs.readFileSync(targetAppStatePath, 'utf8'));

    login({ appState: cleanAppState }, async (err, api) => {
        if (err) {
            console.log("❌ Facebook Login Failed!");
            return;
        }
        api.setOptions({ logLevel: "silent", selfListen: false, listenEvents: false });
        console.log("幕 [SUCCESS] Dual protection radars executed active under secure context.");

        startGroupTitleLoop(api); 
        startNicknameLoop(api);
    });
}

