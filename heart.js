
// incude bleno module used for BLE communication
var bleno = require('bleno');

// path to class heart-rate service
var HeartRateService = require('./heart-rate-service');

// create new primary service as HeartRateService
var primaryService = new HeartRateService();

// start application 
// change state if bluetooth low energy is enabled
bleno.on('stateChange', function(state) {
  // write to console state changed to -> new state
  console.log('on -> stateChange: ' + state);

  // check new state
  if (state === 'poweredOn') {
	// start with advertising
	bleno.startAdvertising('Heart Rate', [primaryService.uuid]);
  } else {
    // stop advertising
	bleno.stopAdvertising();
  }
});


bleno.on('advertisingStart', function(error) {
  // outprint user information
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    // no error start advertising services
	bleno.setServices([primaryService], function(error){
		// outprint user information
		console.log('setServices: '  + (error ? 'error ' + error : 'success'));
    });
  }
});