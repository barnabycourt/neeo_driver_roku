'use strict';

const Nodeku = require('nodeku');
const Device = require('nodeku/lib/device');
const keys = require('nodeku/lib/keys');
const debug = require('debug')('neeo_roku_driver:controller');

const SEARCH_TIMEOUT = 10 * 1000;


// TODO Work with multiple  SSDP devices
// TODO Update nodeku to save the device ID from the USN header:   USN: 'uuid:roku:ecp:4E654J116572', where the last bit is the device ID

let devices = {};

let discoverDevices = (predefined_devices) => {
    let device;
    // First populate any predefined devices
    if (predefined_devices) {
        debug("Using a predefined device: " + predefined_devices);
        if (!predefined_devices.includes(":")) {
            debug("Device docesn't contain a port, appending one now");
            predefined_devices = predefined_devices + ":8060";
        }
        debug("Sending info to " + predefined_devices);
        let predefined_device = Device(predefined_devices);
        predefined_device.info().then(info_result => {
            debug(`Configuring predefined device: ${info_result["device-id"]}`);
            devices[info_result["device-id"]] =
                {
                    id: info_result["device-id"],
                    name: info_result["user-device-name"],
                    device: predefined_device,
                };
        }).catch(err => {
            debug(err.stack);
        });
        debug("Finished setting up device");
        return [{
            id: 'roku1',
            name: 'rokuName1',
            device: predefined_device,
        }];
    }
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
        });

};

let key_map = {
    'CURSOR LEFT': keys.LEFT,
    'CURSOR RIGHT': keys.RIGHT,
    'CURSOR UP': keys.UP,
    'CURSOR DOWN': keys.DOWN,
    'CURSOR ENTER': keys.SELECT,
    'MENU': keys.HOME,
    'BACK': keys.BACK
};

module.exports.onButtonPressed = function (button_name, device_id) {
    debug(`ButtonPressed Device: ${device_id}: ${button_name} button pressed`);

    let device = devices[device_id].device;
    if (!device) {
        debug(`Device: ${device_id} not found`);
        return;
    }
    if (key_map.hasOwnProperty(button_name)) {
        debug(`sending key ${key_map[button_name]}`);
        device.keypress(key_map[button_name]);
    }
    if (button_name.startsWith("app:")) {
        let app_id = button_name.substring(4);
        debug(`launching app ${app_id}`);
        device.launch(app_id);
    }
};


module.exports.initialize = function () {
    debug("Initializing roku controller, performing initial discovery");
    discoverDevices(process.env.ROKU_DEVICES)
};

module.exports.discoverRokuDevices = function () {
    debug('Getting Discovery Function');
    debug(devices);
    return Object.values(devices);
};

