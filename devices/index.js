'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');
const debug = require('debug')('neeo_roku_driver');

const discoveryInstructions = {
    headerText: 'ROKU Discovery',
    description: 'Discovery of Roku devices depends on SSDP being enabled for your network. ' +
    'If discovery does not work, please adjust your router settings and try again.'
};


const rokuDevice = neeoapi.buildDevice('Roku IP Control')
    .setManufacturer('NEEO')
    .addAdditionalSearchToken('Roku')
    .setType('VOD')
    .addCapability('alwaysOn')

    // Add the physical buttons
    .addButtonGroup('Controlpad')
    .addButtonGroup('Menu and Back')

    // Add shortcut buttons
    .addButton({ name: 'app:12', label: 'Netflix' })
    .addButton({ name: 'app:13', label: 'Amazon' })

    .addButtonHander(controller.onButtonPressed)
    .enableDiscovery(discoveryInstructions, controller.discoverRokuDevices);


//Trigger device discovery automatically. Seed the value from the environment if predefined defined
debug("Starting initial discovery via package import since NEEO doesn't support a promise based discovery");

controller.initialize();

module.exports = {
    devices: [rokuDevice]
};