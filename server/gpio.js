const Gpio = require('pigpio').Gpio;

const { delay } = require('./utils');

async function trigger() {

    const motor = {
        gpio: new Gpio(12, { mode: Gpio.OUTPUT }),
        pulseWidth: 1000
    }

    //                  PW   Delay  Step
    await moveTo(motor, 2000, 1000, 100); // <-- Open
    await moveTo(motor, 1000, 1000, 100); // <-- Close
}

async function start() {

    console.log('start');
    // use this to set anything you need to a zero state.
}

async function moveTo(motor, target, time, step) {

    step = Math.abs(step);
    if (target < motor.pulseWidth) {
        step *= -1;
    }

    while (Math.abs(motor.pulseWidth - target) > 0.2) {
        await delay(time);

        motor.pulseWidth += step;
        console.log(`step ${motor.pulseWidth}`);
        motor.gpio.servoWrite(motor.pulseWidth);
    }

    motor.pulseWidth = target;
    motor.gpio.servoWrite(motor.pulseWidth);
}

module.exports = { trigger, start };