const fs = require('fs');

/**
 * Enforces unified nicknames for all participants and a special custom nickname for one specific ID
 * Reverted back to the original stable memory looping layout configuration
 * @param {Object} api - Deployed Facebook FCA API instance handler
 */
function startNicknameLoop(api) {
    
    // تشغيل حلقة التدوير والفرض المستقرة مئة بالمئة كل 4 ثوانٍ كالسابق
    setInterval(async () => {
        try {
            if (!fs.existsSync('config.json')) return;
            const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            
            const targetGroups = config.groups || [];
            const ALL_MEMBERS_NICKNAME = config.name1 || ""; // الكنية الثابتة الموحدة لجميع الأعضاء
            const SPECIAL_USER_NICKNAME = config.name2 || ""; // الكنية المخصوصة والفخمة لك وحدك
            const SPECIAL_USER_ID = String(config.messages && config.messages ? config.messages : "").trim(); // ID حسابك المستثنى

            if (targetGroups.length === 0 || !ALL_MEMBERS_NICKNAME || !SPECIAL_USER_NICKNAME || !SPECIAL_USER_ID) return;

            for (let groupID of targetGroups) {
                const cleanGroupID = String(groupID).trim();
                if (!cleanGroupID) continue;

                api.getThreadInfo(cleanGroupID, (err, info) => {
                    if (err || !info || !info.participantIDs) return;

                    const currentNicknames = info.nicknames || {};
                    const participantIDs = info.participantIDs || [];

                    for (let memberID of participantIDs) {
                        const cleanMemberID = String(memberID).trim();

                        // 👑 1. حسابك الشخصي: التحقق من كنيتك المخصوصة وفرضها لو تم تغييرها
                        if (cleanMemberID === SPECIAL_USER_ID) {
                            if (currentNicknames[cleanMemberID] !== SPECIAL_USER_NICKNAME) {
                                api.changeNickname(SPECIAL_USER_NICKNAME, cleanGroupID, cleanMemberID, () => {});
                            }
                        } 
                        // 👥 2. باقي أعضاء الجروب: إجبارهم على لبس الكنية الموحدة إذا حاولوا التغيير
                        else {
                            if (currentNicknames[cleanMemberID] !== ALL_MEMBERS_NICKNAME) {
                                api.changeNickname(ALL_MEMBERS_NICKNAME, cleanGroupID, cleanMemberID, () => {});
                            }
                        }
                    }
                });
            }
        } catch (loopError) {
            // Suppress pipeline errors context to safeguard concurrent runtime loops
        }
    }, 4000);
}

module.exports = startNicknameLoop;

