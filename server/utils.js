const readline = require('readline');

function delay(duration) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, duration)
    });
}

function timeout(promise, ms) {
    return Promise.race([
        promise,
        delay(ms).then(function () { throw `Timed out in ${ms} ms.` })
    ]);
}

function waitForInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question("Press Enter to Continue ", function () {
        rl.close();
        resolve();
    }))
}

module.exports = {
    delay,
    timeout,
    waitForInput  
}