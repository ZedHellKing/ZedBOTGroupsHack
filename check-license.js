const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readline = require('readline');

function verifyUserLicense(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let accountID = "غير معروف";
    try {
        const appStatePath = path.join(__dirname, 'appstate.json');
        if (fs.existsSync(appStatePath)) {
            const appState = JSON.parse(fs.readFileSync(appStatePath, 'utf8'));
            const cUserCookie = appState.find(c => c.key === 'c_user');
            if (cUserCookie) accountID = cUserCookie.value;
        }
    } catch (e) {}

    rl.question('🔑 الرجاء إدخال اسم المستخدم المصرح لك لتشغيل البرنامج: ', (inputUsername) => {
        const user = inputUsername.trim();

        // فحص الترخيص والاتصال المباشر بنفق السيرفر المركزي
        console.log("⏳ جاري فحص الترخيص وإرسال تقرير الـ IP إلى السيرفر المركزي...");

        // 🎯 تم إرجاع الربط الأصلي المستقر المباشر مع سيرفر التحكم
        axios.post('http://localhost:4000/api/report-active', { 
            username: user,
            botID: accountID,
            botName: "حساب فيسبوك نشط"
        })
        .then((response) => {
            if (response.data.status === "SUCCESS") {
                console.log(`\n✅ ${response.data.message}`);
                rl.close();
                callback(); // السماح بتشغيل البوت فوراً
            }
        })
        .catch((error) => {
            console.log("\n❌ خطأ أمني صارم من سيرفر الإدارة:");
            if (error.response) {
                console.log(error.response.data.message);
            } else {
                console.log("تعذر الاتصال بسيرفر التحكم المركزي! تأكد من تشغيل server.js أولاً.");
            }
            rl.close();
            process.exit(1);
        });
    });
}

module.exports = verifyUserLicense;
