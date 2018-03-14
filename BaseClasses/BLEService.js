/**
 * Class BLESerice extends bleno.PrimaryService class
 * It is the main class for all created services.
 *
 * @class BLEService
 * @extends bleno
 *
 * @constructor BLEService
 * @param {Object} params Object params contains service uuid and characteristics array
 *
 * @author gwu
 * @version 1.0
 */

/**
 * Module dependencies
 *
 */
const bleno = require('bleno');
const util = require('util');

// define a variable for the bleno modul base class
const BlenoPrimaryService = bleno.PrimaryService;

/**
 * Constructor for BLEService calls super constructor from the bleno base class PrimaryService
 *
 */
function BLEService(params) {
    BLEService.super_.call(this, {
        /**
         * @property uuid
         * @type String
         */
        uuid: params.uuid,
        /**
         * @property characteristics
         * @type Array
         */
        characteristics: params.characteristics
    });
}

/**
 * Function toString returns a textual representation of a service and its containing characteristics.
 *
 * @method toString
 * @return {String} string
 * @for BLEService
 */
BLEService.prototype.toString = function() {
    return JSON.stringify({
        uuid: this.uuid,
        characteristics: this.characteristics
    });
};

util.inherits(BLEService, BlenoPrimaryService);

// export class as BLEService
module.exports = BLEService;