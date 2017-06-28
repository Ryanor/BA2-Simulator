var bleno = require('bleno');

var BatteryService = require('./battery-service');
var HeartRateService = require('./heart-rate-service');


var battery = new BatteryService();
var heartRate = new HeartRateService();

var services = [ battery, heartRate];

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('BLE Services', ['12AB']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices( services, function(error){
		// outprint user information
		console.log('setServices: '  + (error ? 'error ' + error : 'success'));
    });
  }
});