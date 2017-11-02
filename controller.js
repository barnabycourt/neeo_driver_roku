'use strict';

const Nodeku = require('nodeku');

const debug = require('debug')('neeo_roku_driver');

const SEARCH_TIMEOUT = 10 * 1000;


// TODO Make device discovery clean & less of an utter hack
// TODO Work with multiple devices
// TODO Figure out how to map function buttons.
// TODO Update nodeku to save the device ID from the USN header:   USN: 'uuid:roku:ecp:4E654J116572', where the last bit is the device ID

let devices = {};

let discoverDevices = () => {
    let device, info;
    Nodeku(SEARCH_TIMEOUT)
        .then(device_found => {
            device = device_found;
            debug(`device found at: ${device.ip()}`);
            return device.info();
        })
        .then(info_result => {
            devices[info_result["device-id"]] =
                {
                    id: info_result["device-id"],
                    name: info_result["user-device-name"],
                    device: device,

                };
        })
        .catch(err => {
            debug(err.stack);
        })
};

//Trigger device discovery automatically
discoverDevices();

let key_map = {
    'CURSOR LEFT': 'left',
    'CURSOR RIGHT': 'right',
    'CURSOR UP': 'up',
    'CURSOR DOWN': 'down',
    'CURSOR ENTER': 'select',
    'MENU': 'Home',
    'BACK': 'Back'

};

module.exports.onButtonPressed = function (button_name, device_id) {
    debug(`ButtonPressed Device: ${device_id}: ${button_name} button pressed`);
    let device = devices[device_id];

    if (!device) {
        debug(`Device: ${device_id} not found`);
        return;
    }
    if (key_map.hasOwnProperty(button_name)) {
        debug(`sending key ${key_map[button_name]}`);
        device.keypress(key_map[button_name]);
    }
};

module.exports.discoverRokuDevices = function () {
    debug('Getting Discovery Function');
    return Object.values(devices);
};
