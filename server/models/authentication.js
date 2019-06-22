const db = require('../db');

const AUTH_DOC = 'streamlabs_auth';

async function get() {
    const results = await db.find({ name: AUTH_DOC });

    if (results.length === 0) {
        throw "auth data not found";
    }

    const auth = results[0];
    return {
        accessToken: auth.access_token,
        refreshToken: auth.refresh_token
    }
}

async function update(accessToken, refreshToken)
{
    const data = {
        name: AUTH_DOC,
        access_token: accessToken,
        refresh_token: refreshToken
    }
    return await db.update({ name: AUTH_DOC }, data, { upsert: true });
}

module.exports = {
    get,
    update
}