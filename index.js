'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

const discoveryInstructions = {
    headerText: 'ROKU Discovery',
    description: 'Discovery of Roku devices depends on SSDP being enabled for your network. ' +
    'If discovery does not work, please adjust your router settings and try again.'
};


const rokuDevice = neeoapi.buildDevice('Roku IP Control')
    .setManufacturer('NEEO')
    .addAdditionalSearchToken('Roku')
    .setType('VOD')

    // Add the physical buttons
    .addButtonGroup('Controlpad')
    .addButtonGroup('Menu and Back')

    // Add shortcut buttons
    // .addButton({ name: 'netflix', label: 'Netflix' })
    // .addButton({ name: 'amazon', label: 'Amazon' })

    // Add the power button group so neeo doesn't think the device is stupid
    .addButtonGroup('Power')
    .addButtonHander(controller.onButtonPressed)
    .enableDiscovery(discoveryInstructions, controller.discoverRokuDevices);

function startSdkExample(brain) {
    console.log('- Start server');
    neeoapi.startServer({
        brain,
        port: 6336,
        name: 'rokuBridge',
        devices: [rokuDevice]
    })
        .then(() => {
            console.log('# READY! use the NEEO app to search for "Roku IP Control".');
        })
        .catch((error) => {

            //if there was any error, print message out to console
            console.error('ERROR!', error.message);
            process.exit(1);
        });
}

const brainIp = process.env.BRAINIP;
if (brainIp) {
    console.log('- use NEEO Brain IP from env variable', brainIp);
    startSdkExample(brainIp);
} else {
    console.log('- discover one NEEO Brain...');
    neeoapi.discoverOneBrain()
        .then((brain) => {
            console.log('- Brain discovered:', brain.name);
            startSdkExample(brain);
        });
}