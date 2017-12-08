/**
 * Class EnvironmentService extends bleno.PrimaryService class
 * Main class for the environment service including
 * HumidityCharacteristic
 * PressureCharacteristic
 * The environment service sets the UUID to the SIG defined value.
 *
 * @author gwu
 * @version 1.0
 */

// import utility library to build classes
var util = require('util');

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

// create the PrimaryService class which the battery class inherits from
var BlenoPrimaryService = bleno.PrimaryService;

// predefine the included characteristics of the service
var HumidityCharacteristic = require('./humidity-characteristic');
var PressureCharacteristic = require('./pressure-characteristic');

/**
 * Constructor for HeartRateService calls constructor from the parent class PrimaryService
 * Defines the UUID for the service
 * Includes characteristics used
 */
function EnvironmentService() {
    EnvironmentService.super_.call(this, {
        uuid: '181A',
        characteristics: [
            new HumidityCharacteristic(),
            new PressureCharacteristic()
        ]
    });
}

// define inhertance
util.inherits(EnvironmentService, BlenoPrimaryService);

// export class as HeartRateService
module.exports = EnvironmentService;