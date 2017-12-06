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

var http = require('http');

// create the PrimaryService class which the battery class inherits from
var BlenoPrimaryService = bleno.PrimaryService;

// create the Characteristic class which the battery level characteristic inherits from
var Characteristic = bleno.Characteristic;

// predefine the included descriptors of the service
var Descriptor = bleno.Descriptor;


// import class BatteryService
var BatteryService = require('./BatteryProfile/battery-service');

// import class HeartRateService
var HeartRateService = require('./HeartRateProfile/heart-rate-service');

// import class IPAddressService
var IPAddressService = require('./IPAddressProfile/ip-address-service');

// import class ThermometerService
var ThermometerService = require('./ThermometerProfile/thermometer-service.js');

// creates BatteryService object
var battery = new BatteryService();

// creates HeartRateService object
var heartRate = new HeartRateService();

// create IPAddressService object
var ipaddress = new IPAddressService();

// create ThermometerService object
var thermometer = new ThermometerService();

// creates array of service objects
//var services = [battery, heartRate, ipaddress, thermometer];

var services = [];

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
        console.log(data);
        // callback to build all services from response message

        profile = JSON.parse(data);
        console.log(profile[0].uuid);

        var characteristics = profile[0].characteristics;
        console.log(characteristics.length);
        for(var char in characteristics) {
            var characteristic = characteristics[char];

            console.log(characteristic.uuid);
            console.log(characteristic.value);
            console.log(characteristic.values.length);
            console.log(characteristic.descriptors.length);
            for(var descr in characteristic.descriptors) {
                var descriptor = characteristic.descriptors[descr];
                console.log(descriptor.uuid);
                console.log(descriptor.value);
            }
        }

        function Service() {
            Services.super_.call(this, {
                uuid: profile[0].uuid,
                characteristics: []
            });
        }
        services.push(Service);
    });


}).on("error", function (err) {
    console.log("Error: " + err.message);
});


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
        bleno.startAdvertising('BLE Services', ['12AB']);
    } else {
        // stop advertising
        bleno.stopAdvertising();
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
            console.log('setServices: ' + (error ? 'error ' + error : 'success'));
        });
    }
});