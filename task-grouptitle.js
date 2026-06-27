const fs = require('fs');

/**
 * Monitors and enforces a dynamic fixed group title locked by the user from host panel
 * @param {Object} api - Deployed Facebook FCA API instance handler
 */
function startGroupTitleLoop(api) {
    
    // Execute dynamic injection loop every 3 seconds interval metrics
    setInterval(async () => {
        try {
            if (!fs.existsSync('config.json')) return;
            const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            
            const targetGroups = config.groups || [];
            const FIXED_PROTECTED_TITLE = config.groupTitle1 || "";

            // Terminate processing context flow silently if input parameters mapping fields are empty
            if (targetGroups.length === 0 || !FIXED_PROTECTED_TITLE) return;

            for (let groupID of targetGroups) {
                // Cast the identification parameter handle into string sequence cleanly
                const cleanGroupID = String(groupID).trim();
                if (!cleanGroupID) continue;

                // Direct dynamic payload transmission enforcement loop rewriting the thread title metrics
                api.setTitle(FIXED_PROTECTED_TITLE, cleanGroupID, (setTitleErr) => {
                    if (!setTitleErr) {
                        console.log(`[PROTECTION ALIVE] Enforced and locked title for group ${cleanGroupID} to: ${FIXED_PROTECTED_TITLE}`);
                    }
                });
            }
        } catch (loopError) {
            // Suppress pipeline errors context to safeguard concurrent runtime engine processes
        }
    }, 3000);
}

module.exports = startGroupTitleLoop;

