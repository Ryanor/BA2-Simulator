/**
 * Main class of the BLE-Simulator.
 * This class includes the module bleno for the BLE communication.
 * It loads data from a webservice and parses it to services, characteristics and descriptors.
 * Creates a device out of these services, characteristics and descriptors.
 * Advertises the created device to surrounding master devices, which can connect to the device to
 * share data using onRead- onWrite-Request and subscribe and unsubscribe to notifications.
 *
 * @class main
 * @uses bleno
 * @uses http
 * @uses ip
 * @uses BLEService
 * @uses BLECharacteristic
 *
 * @author gwu
 * @version 1.0
 */
// Module dependencies
const bleno = require('bleno');
const http = require('http');
const ip = require('ip');

// variable for the extended service class
const BLEService = require('./BLEClasses/BLEService');
// variable for the extended characteristic class
const BLECharacteristic = require('./BLEClasses/BLECharacteristic');
// // define a variable for a descriptor from the bleno modul base class
const BlenoDescriptor = bleno.Descriptor;

// import class IPAddressService
const IPAddressService = require('./IPAddressProfile/ip-address-service');
// create IPAddressService
const ipaddress = new IPAddressService();

// create array of service objects and add ipaddress service
let services = [ipaddress];

// create variable to store the parsed server response as json array
let profile;

// get the actual ip address of the device and use it to connect to the webservice running on same device
const address = ip.address();

/**
 * Connect to the webservice and get the actual profile as json array.
 * The received data is parsed to json which is used to build all of
 * the profiles services, characteristics and descriptors.
 *
 * @method http.get
 * @param address Address of the webservice
 * @param resp Response from the webservice
 * @return {Array} services All services, which were built out of the response profile
 * @for main
 */
http.get("http://" + address + ":3000/startProfile/profile", function (resp) {
    let data = '';

    /**
     * As long as data is received from the connected webservice,
     * data is added to a container.
     *
     * @method resp.on('data')
     * @param {Event} event Data event
     * @return {Object} data Container of data
     * @for main
     */
    resp.on('data', function (chunk) {
        data += chunk;
    });

    /**
     * After the data transfer is finished, the data variable
     * must be checked if it contains enough data to parse a profile from it.
     * Otherwise it may be the first start and only the ip address service is available,
     * which will always be included for any profile to get the IP address for the Raspberry Pi 3.
     *
     * @method resp.on('end')
     * @param {Event} event End of data event
     * @for main
     */
    resp.on('end', function () {
        // check if the received data contains the minimum size for a profile = empty profile without any data
        if (data.length < 15) {
            console.log("Not enough response data for parsing a profile!");
            console.log("Only IP address service available.");
        } else {
            // parse server response data to profile
            console.log("Length:" + data.length);
            profile = JSON.parse(data);
            // build all services in the profile
            if (profile.hasOwnProperty("services")) {

                // Service
                // get a single service from the array
                for (let i in profile["services"]) {
                    let singleService = profile["services"][i];

                    // Characteristic
                    // create an empty characteristics array
                    const characteristics = [];
                    // get all characteristics included in the service
                    const characteristicContainer = singleService.characteristics;
                    // check if characteristics are available
                    if (characteristicContainer.length > 0) {
                        // iterate over all characteristics
                        for (let char in characteristicContainer) {
                            // get a single characteristic
                            const characteristic = characteristicContainer[char];

                            // Descriptor
                            // create an empty descriptors array
                            const descriptors = [];
                            // check if descriptors are available
                            if (characteristic.descriptors.length > 0) {
                                // iterate over all descriptors
                                for (let descr in characteristic.descriptors) {
                                    // check for a descriptors with UUID 2902 which have to be build by the bleno modul
                                    if (characteristic.descriptors[descr].uuid.indexOf('2902') === -1) {
                                        let value;
                                        // check if the value type is of byte or string
                                        if (characteristic.descriptors[descr].datatype === "bytes") {
                                            value = new Buffer(hexStringToBytes(characteristic.descriptors[descr].value), "hex");
                                        } else {
                                            value = characteristic.descriptors[descr].value;
                                        }
                                        // add the new descriptor to the array
                                        descriptors.push(new BlenoDescriptor({
                                            uuid: characteristic.descriptors[descr].uuid,
                                            value: value
                                        }));
                                    }
                                }
                            } // END Descriptor

                            // if value and more properties are set: change them to a read only characteristic
                            if (characteristic.value !== null) {
                                characteristic.properties = ['read'];
                                characteristic.characteristicType = 'single';
                            }
                            // fallback to set the actual characteristic type, if old data is used
                            if (characteristic.characteristicType === undefined) {
                                // values array has data
                                if (characteristic.values.length > 0) {
                                    characteristic.characteristicType = 'array';
                                    // base value is set
                                } else if (characteristic.base !== 0) {
                                    characteristic.characteristicType = 'base';
                                } else {
                                    // make a random characteristic with fallback values
                                    characteristic.characteristicType = 'random';
                                    characteristic.min = 1;
                                    characteristic.max = 100;
                                }
                            }

                            const bleCharacteristic = new BLECharacteristic({
                                uuid: characteristic.uuid,
                                properties: characteristic.properties,
                                value: characteristic.value,
                                descriptors: descriptors,
                                datatype: characteristic.datatype,
                                offset: characteristic.offset,
                                interval: characteristic.interval,
                                values: characteristic.values,
                                base: characteristic.base,
                                min: characteristic.min,
                                max: characteristic.max,
                                characteristicType: characteristic.characteristicType
                            });

                            characteristics.push(bleCharacteristic);
                        }
                    } // END Characteristic

                    // create service from base class
                    const bleService = new BLEService({
                        uuid: singleService.uuid,
                        characteristics: characteristics
                    });
                    // add service to services array
                    services.push(bleService);
                }
            } // END Service
        }
    });

    /**
     * Function is listening to errors while data is received
     * Log error to console.
     *
     * @method resp.on('error')
     * @param {Event} event Error event
     * @for main
     */
    resp.on('error', function (err) {
        console.log("Respnonse error: " + err);
    });

}).on("error", function (err) {
    console.log("Error: " + err.message);
});

/**
 * Functions listens to stateChange events.
 * If the state changes to poweredOn the GAP service including the device name and uuid is set up
 * and the advertising event is triggered.
 * BLE device name 'BLE Simulator' and a uuid '89AB'.
 * Otherwise the program exits with exit code 11.
 *
 * @method bleno.on('stateChange')
 * @param {Event} event State changed event
 * @for main
 */
bleno.on('stateChange', function (state) {
    console.log("Program started");
    delay(2000);
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        // create the GAP service with the device name and a uuid and switch to start advertising state
        bleno.startAdvertising('BLE Simulator', ['89AB']);
    } else {
        // stop advertising
        bleno.stopAdvertising();
        console.log('Stopping program');
        process.exit(11);
    }
});

/**
 * Functions listens to advertisingStart event.
 * If the state changes to advertisingStart, all services, including characteristics and descriptors are set up.
 *
 *
 * @method bleno.on('advertistinStart')
 * @param {Event} event Advertising start event
 * @param {Array} services Array of all services containing characteristics and descriptors
 * @for main
 */
bleno.on('advertisingStart', function (error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        // Set up the services, characteristics and descriptors using the services array
        bleno.setServices(services, function (error) {
            console.log('setServices: ' + (error ? 'error ' + error : 'success'));
        });
    }
});

/**
 * This delay function is necessary to make sure all data from the HTTP response
 * is completely read and parsed into a profile.
 *
 * @method delay
 * @param {Number} ms Time in milliseconds
 * @for main
 */
function delay(ms) {
    ms += new Date().getTime();
    while (new Date() < ms) {
    }
}

/**
 * Function removes all characters from a hexadecimal string to get
 * a pure string that contains values to build a Buffer from it.
 *
 * @method hexStringToBytes
 * @param {String} hexstring Hexadecimal string in form of "0x00, 0x23"
 * @return {String} hexstring Cleared string for building a Buffer like "0023"
 * @for main
 */
function hexStringToBytes(hexstring) {
    hexstring = hexstring.replace(/, /g, "");
    hexstring = hexstring.replace(/0x/g, "");
    return hexstring;
}