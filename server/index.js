require('dotenv').config()

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const { timeout } = require('./utils');
const { start, trigger } = require('./gpio');
const streamlabs = require('./streamlabs');

const authentication = require('./models/authentication');
const config = require('./models/config');

const DIST_DIR = './dist';
const HTML_FILE = path.join(__dirname, '..', 'index.html');
const PORT = process.env.PORT || 8080;

const STREAMLABS_API_BASE = 'https://www.streamlabs.com/api/v1.0'

const eventQueue = [];
let eventActive = false;

const app = express();
app.use(express.json());
app.use(express.static(DIST_DIR))

app.get('/', function (req, res) {

    authentication.get().then(function () {

        res.sendFile(HTML_FILE);

    }).catch(function () {

        const params = {
            'client_id': process.env.CLIENT_ID,
            'redirect_uri': process.env.REDIRECT_URI,
            'response_type': 'code',
            'scope': 'socket.token',
        }

        const authorize_url = `${STREAMLABS_API_BASE}/authorize?` + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
        res.send(`<a href="${authorize_url}">Authorize with Streamlabs!</a>`);
    });
});

app.get('/api/auth', async function (req, res) {

    const code = req.query.code
    const results = await fetch(`${STREAMLABS_API_BASE}/token?`, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            'grant_type': 'authorization_code',
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'redirect_uri': process.env.REDIRECT_URI,
            'code': code
        })
    });
    const data = await results.json();

    if (data.error) {
        res.send(data);
        return;
    }

    await authentication.update(data.access_token, data.refresh_token);
    res.redirect('/');
})

app.get('/api/config', async function (req, res) {

    const result = await config.get();
    res.send(result);
});

app.post('/api/config', async function (req, res) {

    const body = req.body;
    const result = config.update(body.triggers, body.settings);
    res.send({ result });
});

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')

    

    timeout(streamlabs.connect(), 5000).then(function (socket) {

        socket.on('event', (eventData) => {

            eventQueue.push(eventData);
            checkQueue();            
        });

    }).catch(function (error) {
        console.log(error);
    });
});

async function checkQueue()
{
    if(eventActive)
    {
        return;
    }

    eventActive = true;

    while(eventQueue.length > 0)
    {
        const eventData = eventQueue.pop();
        await handleEvent(eventData);
    }

    eventActive = false;
}

async function handleEvent(eventData) {

    const data = await config.get();
    const triggers = data.triggers;

    if (eventData.type === 'donation') {

        const amount = eventData.message[0].amount;
        const settings = data.settings.donation;

        if (triggers.donations) {

            if (amount > settings.min && amount < settings.max) {
                await trigger();
                return;
            }
        }
    }

    if (eventData.for === 'twitch_account') {

        switch (eventData.type) {

            case 'bits':
                const amount = eventData.message[0].amount;
                const settings = data.settings.bits;

                if (triggers.bits) {

                    if (amount > settings.min && amount < settings.max) {
                        await trigger();
                    }
                }
                return;

            case 'subscription':
                if (triggers.subscription) {
                    await trigger();
                }
                return;
        }
    }
}

