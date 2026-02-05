const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("OpenQuestModule", (m) => {
    const openQuest = m.contract("OpenQuest");

    return { openQuest };
});
