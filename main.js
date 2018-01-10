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


// import class BatteryService
var BatteryService = require('./BatteryProfile/battery-service');

// import class HeartRateService
//var HeartRateService = require('./HeartRateProfile/heart-rate-service');

// import class IPAddressService
var IPAddressService = require('./IPAddressProfile/ip-address-service');

// import class ThermometerService
//var ThermometerService = require('./ThermometerProfile/thermometer-service.js');

// import class EnvironmentService
var EnvironmentService = require('./EnvironmentProfile/environment_service.js');

// creates BatteryService object
var battery = new BatteryService();

// creates HeartRateService object
//var heartRate = new HeartRateService();

// create IPAddressService object
var ipaddress = new IPAddressService();

// create ThermometerService object
//var thermometer = new ThermometerService();

// create EnvironmentService object
var environment = new EnvironmentService();

// creates array of service objects
var services = [ipaddress, battery, environment];


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
            console.log("Set services:");
            for(var service in services) {
                console.log((service + 1) + ". Service set");
            }
            console.log('setServices: ' + (error ? 'error ' + error : 'success'));
        });
    }
});