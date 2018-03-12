/**
 * Main class for the BLE-Simulator
 * includes module bleno for the BLE communication
 * Creates service objects which will be advertised to master devices
 * If a master connects to a service it can send onRead- onWriteRequest
 * and subscribe and unsubscribe to notifications
 *
 * @class main
 * @author gwu
 * @version 1.0
 */
// include module dependencies
const bleno = require('bleno');

const http = require('http');

const ip = require('ip');

// import the base service class where every service inherits from
const BLEService = require('./BaseClasses/BLEService');
// import the base characteristic class where every characteristic inherits from
const BLECharacteristic = require('./BaseClasses/BLECharacteristic');
// import basic descriptor from the modul bleno
const BlenoDescriptor = bleno.Descriptor;

// import class IPAddressService
const IPAddressService = require('./IPAddressProfile/ip-address-service');
// create IPAddressService object
const ipaddress = new IPAddressService();

// creates array of service objects
let services = [ipaddress];

// create variable to store the server response as json objects
let profile;

// get the actual ip address of the device and use it to connect to the webservice running on same device
const address = ip.address();

/**
 * Connect to the webservice and get the actual profile as json array
 * @param address Address of the webservice
 * @param resp Response form the webservice either a json
 * @result services[] Add services included in the profile data to the services array
 */
http.get("http://" + address + ":3000/startProfile/json", function (resp) { //"http://192.168.0.5:3000/profile/5a70b649653cbc02231a3d07", function (resp) { //"http://" + address + ":3000/startProfile/json", function (resp) { //5a70da6e653cbc02231a3d20
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', function (chunk) {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', function () {
        // parse server response data to profile
        profile = JSON.parse(data);
        console.log("Profile:");
        console.log(profile);

        // build all services from response message
        if (profile.hasOwnProperty("services")) {
            console.log("Profile has property services");

            // get a single service from the array
            for (var i in profile["services"]) {
                var singleService = profile["services"][i];
                console.log("Service name: " + singleService.name);
                console.log("Service UUID: " + singleService.uuid);

                const characteristics = [];
                const characteristicContainer = singleService.characteristics;
                console.log("Amount of characteristics: " + characteristicContainer.length);

                // check if characteristics are available
                if (characteristicContainer.length > 0) {

                    // get type data
                    for (let char in characteristicContainer) {
                        const characteristic = characteristicContainer[char];
                        console.log("Char. name: " + characteristic.name);
                        console.log("Char. uuid: " + characteristic.uuid);
                        console.log("Char. properties: " + characteristic.properties);
                        console.log("Char. value: " + characteristic.value);
                        console.log("Char. datatype: " + characteristic.datatype);
                        console.log("Char. values length: " + characteristic.values.length);

                        const descriptors = [];

                        if (characteristic.descriptors.length > 0) {

                            for (let descr in characteristic.descriptors) {
                                console.log("Descr. name: " + characteristic.descriptors[descr].name);
                                console.log("Descr. uuid: " + characteristic.descriptors[descr].uuid);
                                console.log("Descr. datatype: " + characteristic.descriptors[descr].datatype);

                                let value;
                                if (characteristic.descriptors[descr].datatype === "bytes") {
                                    value = new Buffer(hexStringToBytes(characteristic.descriptors[descr].value), "hex");
                                } else {
                                    value = characteristic.descriptors[descr].value;
                                }
                                console.log("Descr. value: ");
                                console.log(value);
                                descriptors.push(new BlenoDescriptor({
                                    uuid: characteristic.descriptors[descr].uuid,
                                    value: value
                                }));
                            }
                        }

                        let type;

                        if (characteristic.values.length > 1) {
                            type = 'array';
                            console.log("Characteristic type = array");
                        } else if (characteristic.base === 0) {
                            type = 'range';
                            console.log("Characteristic type = range");
                        } else {
                            type = 'base';
                            console.log("Characteristic type = base");
                        }
                        const bleCharacteristic = new BLECharacteristic({
                            uuid: characteristic.uuid,
                            properties: characteristic.properties,
                            descriptors: descriptors,
                            datatype: characteristic.datatype,
                            offset: characteristic.offset,
                            interval: characteristic.interval,
                            values: characteristic.values,
                            base: characteristic.base,
                            min: characteristic.min,
                            max: characteristic.max,
                            type: type
                        });

                        characteristics.push(bleCharacteristic);
                    }
                }

                // create service from base class
                const bleService = new BLEService({
                    uuid: singleService.uuid,
                    characteristics: characteristics
                });
                // add service to services array
                services.push(bleService);
            }
        }

        // print all services to screen
        for (var i in services) {
            console.log(services[i].toString());
        }
    });

    resp.on('error', function(err) {
        console.log("Respnonse error: " + err);
    });

});


/**
 * If connection to the server results in an error, print error message to console
 */
http.on("error", function (err) {
    console.log("Error: " + err.message);
});


/**
 * If bleno could connect to the interface and the USB-dongle is plugged in
 * the state changes to power on, and the simulator starts advertising its services
 */
bleno.on('stateChange', function (state) {
    console.log("Programm started");
    delay(2000);
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        // start advertising services
        bleno.startAdvertising('BLE Simulator', ['89AB']);
    } else {
        // stop advertising
        bleno.stopAdvertising();
        console.log('Stopping program');
        process.exit(11);
    }
});

/**
 * If state changes to advertising start,
 * all services and including characteristics and descriptors are set
 */
bleno.on('advertisingStart', function (error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices(services, function (error) {
            console.log("Set services:");
            for (let i = 0; i < services.length; i++) {
                console.log((i + 1) + ". Service set");
            }
            console.log('setServices: ' + (error ? 'error ' + error : 'success'));
        });
    }
});

/**
 * This delay is necessary to make sure all data from the HTTP response is read
 * @param ms Time in milliseconds
 */
function delay(ms) {
    ms += new Date().getTime();
    while (new Date() < ms) {
    }
}

/**
 * Function removes all characters from a hexadecimal string to get
 * a pure string that contains values to build a Buffer from it.
 * @param hexstring Hexadecimal string in form of "0x00, 0x23"
 * @returns hexstring Cleared string for building a Buffer like "0023"
 */
function hexStringToBytes(hexstring) {
    hexstring = hexstring.replace(/, /g, "");
    hexstring = hexstring.replace(/0x/g, "");
    return hexstring;
}