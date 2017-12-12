/**
 * Main class for the BLE-Simulator
 * includes module bleno for the BLE communication
 * Creates service objects which will be advertised to master devices
 * If a master connects to a service it can send onRead- onWriteRequest
 * and subscribe and unsubscribe to notifications
 *
 * @author gwu
 * @version 1.0
 */

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

var util = require('util');

var http = require('http');

// import the base Service class where every service inherits from
var BLEService = require('./BaseClasses/BLEService');

// import the base Service class where every service inherits from
var BLECharacteristic = require('./BaseClasses/BLECharacteristic');

// create the Characteristic class which the battery level characteristic inherits from
//var BlenoCharacteristic = bleno.Characteristic;

// predefine the included descriptors of the service
var BlenoDescriptor = bleno.Descriptor;


// import class BatteryService
//var BatteryService = require('./BatteryProfile/battery-service');

// import class HeartRateService
//var HeartRateService = require('./HeartRateProfile/heart-rate-service');

// import class IPAddressService
var IPAddressService = require('./IPAddressProfile/ip-address-service');

// import class ThermometerService
//var ThermometerService = require('./ThermometerProfile/thermometer-service.js');

// import class EnvironmentService
//var EnvironmentService = require('./EnvironmentProfile/environment_service.js');

// creates BatteryService object
//var battery = new BatteryService();

// creates HeartRateService object
//var heartRate = new HeartRateService();

// create IPAddressService object
var ipaddress = new IPAddressService();

// create ThermometerService object
//var thermometer = new ThermometerService();

// create EnvironmentService object
//var environment = new EnvironmentService();

// creates array of service objects
var services = [ipaddress]; //, environment];

//var services = [];

var profile;

// read ble services from webserver
http.get('http://192.168.0.10:3000/profile/json1', function (resp) {
    var data = '';

    // A chunk of data has been recieved.
    resp.on('data', function (chunk) {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', function () {
        //console.log(data);
        // callback to build all services from response message

        profile = JSON.parse(data);

        var characteristics = [];
        var characteristicContainer = profile[0].characteristics;
        console.log("Amount of characteristics: " + characteristicContainer.length);

        // check if characteristics are available
        if (characteristicContainer.length > 0) {

            // get characteristic data
            for (var char in characteristicContainer) {
                var characteristic = characteristicContainer[char];

                console.log("Char. uuid: " + characteristic.uuid);
                console.log("Char. value: " + characteristic.value);
                console.log("Char. values length: " + characteristic.values.length);
                console.log("Char. properties: " + characteristic.permission);
                console.log("Char. Descr. amount: " + characteristic.descriptors.length);

                if (characteristic.descriptors.length > 0) {

                    var descriptors = [];

                    for (var descr in characteristic.descriptors) {
                        console.log("Descr. uuid: " + characteristic.descriptors[descr].uuid);
                        console.log("Descr. value: " + characteristic.descriptors[descr].value);
                        descriptors.push(new BlenoDescriptor({
                            uuid: characteristic.descriptors[descr].uuid.substr(4, 4).toUpperCase().toString(),
                            value: characteristic.descriptors[descr].value
                        }));
                    }
                }

                //var char = function Characteristic() {
                var bleCharacteristic = new BLECharacteristic({
                    uuid: characteristic.uuid.substr(4, 4).toUpperCase().toString(),
                    properties: characteristic.permission,
                    descriptors: descriptors
                });

                characteristics.push(bleCharacteristic);
            }
        }

        var serviceuuid = profile[0].uuid.substr(4, 4).toUpperCase().toString();
        console.log("Service UUID: " + serviceuuid);

        var bleService = new BLEService({
            uuid: serviceuuid,
            characteristics: characteristics
        });

        services.push(bleService);

        for (var i in services) {
            console.log(services[i].toString());
        }
    });

}).on("error", function (err) {
    console.log("Error: " + err.message);
});

delay(2000);


/*
* If bleno could connection to the interface and the USB-dongle is pluged in
* the state changes to power on, and the simulator starts advertising its services
*
*/
bleno.on('stateChange', function (state) {
    console.log("Programm started");
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        // start advertising services
        bleno.startAdvertising('BLE Simulator', ['12AB']);
    } else {
        // stop advertising
        bleno.stopAdvertising();
        console.log('Stopping program');
        process.exit(11);
    }
});

/*
* If advertising starts all services, characteristics and descriptors are built
*
*/
bleno.on('advertisingStart', function (error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices(services, function (error) {
            // outprint user information
            console.log("Set services:");
            for (var service in services) {
                console.log((service + 1) + ". Service set");
            }
            console.log('setServices: ' + (error ? 'error ' + error : 'success'));
        });
    }
});

function delay(ms) {
    ms += new Date().getTime();
    while (new Date() < ms) {
    }
}