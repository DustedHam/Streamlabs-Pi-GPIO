const db = require('../db');

const CONFIG_DOC = 'config';

const DEFAULT_CONFIG = {
    triggers: { bits: false },
    settings: {
        donation: { min: 0, max: 0 },
        bits: { min: 0, max: 0 }
    }
}

async function get() {
    const results = await db.find({ name: CONFIG_DOC });

    if (results.length === 0) {
        return DEFAULT_CONFIG;
    }

    const config = results[0];
    return {
        triggers: config.triggers,
        settings: config.settings
    }
}

async function update(triggers, settings)
{
    const data = {
        name: CONFIG_DOC,
        triggers,
        settings
    }

    return await db.update({ name: CONFIG_DOC }, data, { upsert: true });
}

module.exports = {
    get,
    update
}