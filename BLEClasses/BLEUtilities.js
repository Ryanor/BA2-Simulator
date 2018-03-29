/**
 * Utilities class contains a static function to write the characteristic value
 * to a buffer. The way the value is written to the buffer depends on its data type:
 * e.g.:
 *    datatype uint8 --> Buffer.writeUInt8(value); No little or big endian format
 *    datatype uint32 --> Buffer.writeUInt32LE(value); Written in little endian format
 *
 * @class Utilities
 *
 * @author gwu
 * @version 1.0
 */

function Utilities() {
};

/**
 * Functions is used to write a value to a buffer using different
 * datatype representations.
 *
 * @method writeBuffer
 * @static
 * @param value Value which is written to the buffer
 * @param datatype Datatype of the value
 * @return {*} buffer Buffer containing the value in the correct datatype representation.
 */
Utilities.writeBuffer = function (value, datatype) {
    let data;

    console.log("Utilities class called");
    switch (datatype) {
        case 'uint8':
            data = Buffer.allocUnsafe(1);
            data.writeUInt8(value, 0);
            break;
        case 'uint16':
            data = Buffer.allocUnsafe(2);
            data.writeUInt16LE(value, 0);
            break;
        case 'uint32':
            data = Buffer.allocUnsafe(4);
            data.writeUInt32LE(value, 0);
            break;
        case 'sint8':
            data = Buffer.allocUnsafe(1);
            data.writeInt8(value, 0);
            break;
        case 'sint16':
            data = Buffer.allocUnsafe(2);
            data.writeInt16LE(value, 0);
            break;
        case 'sint32':
            data = Buffer.allocUnsafe(4);
            data.writeInt32LE(value, 0);
            break;
        case 'float':
            data = new Buffer(value);
            break;

        default :
            if (typeof value === 'string') {
                data = new Buffer(value);
            } else {
                data = new Buffer([value]);
            }
    }
    console.log(data);
    return data;
};

module.exports = Utilities;