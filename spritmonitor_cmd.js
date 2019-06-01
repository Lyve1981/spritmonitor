var sm = require('./spritmonitor.js')

function errorHandler(_err)
{
	console.log("ERROR: " + JSON.stringify(_err));
	process.exit(1);
}

function exitUsage()
{
	console.log('Usage:');
	console.log('node spritmonitor_cmd.js username password addFueling|listCars|listFuelings');
	console.log('  addFueling required options:');
	console.log('    quantity=56.78');
	console.log('    price=67.89');
	console.log('    fuelsort=Diesel|Super gasoline|Electricity|... (see fueltypes.json)');
	console.log('    Either:');
	console.log('      odometer=67890 for total mileage/kilometers of the car');
	console.log('    Or:');
	console.log('      trip=678 for distance of trip since last refueling');
	console.log('  addFueling additional options (all optional):');
	console.log('    quantityunit=l|US.gal|kg|kWh|... (see quantityunits.json)');
	console.log('    currency=EUR|USD|... (see currencies.json)');
	console.log('    "note=Your custom message"');
	console.log('    streets=autobahn,city,land (any combination of these, separated by comma)');
	console.log('    attributes=summertires,normal (any of summertires|wintertires,normal|slow|fast,ac,trailer,heating)');
	console.log('    bc_consumption=7.65 (consumption as indicated by the board computer)');
	console.log('    bc_quantity=47.65 (quantity as indicated by the board computer)');
	console.log('    bc_speed=76 (average trip speed as indicated by the board computer)');
	console.log('    stationname=Aral|Shell|... (see fuelingcompanies.json)');
	console.log('    position=55.555,7.7777 (position as latitude,longitude)');
	console.log('    country=D (two letters country code)');
	console.log('    location=Hamburg (location name, for example city name)');
	console.log('    tank=1|2 (fuel tank id, regular cars only have 1, hybrid cars 1=gasoline, 2=electricity)');
	console.log('    date=03/21/2019|21.03.2019 (any date that can be parsed, note that hour/min/sec is not supported');
	console.log('                                by the API and will be ignored)');
	console.log('  listCars: no options required, returns json of all cars available');
	console.log('  listFuelings: carId [limit=number] returns last limit fuelings as json');
}

var cmd = process.argv[4];

if(cmd == 'addFueling')
{
	var params = {}
	var car = process.argv[5];

	for(var i=6; i<process.argv.length; ++i)
	{
		var args = process.argv[i].split('=');
		
		if(args.length != 2)
		{
			console.log('Invalid argument ' + process.argv[i] + ', needs to be key=value');
			continue;
		}

		var key = args[0];
		var val = args[1];
		
		if(key == 'position')
		{
			var latlon = val.split(',');
			params.position = {
				lat: latlon[0],
				lon: latlon[1]
			};
		}
		else if(key == 'date')
			params.date = new Date(Date.parse(val));
		else
			params[key] = val;
	}
	
	if(!params.date)
		params.date = new Date();
	
	console.log(JSON.stringify(params, null, 4));
	
	sm.addFueling(car, params, (_success) =>
	{
		console.log("Success: " + _success);
		process.exit(0);
	}, errorHandler);
}
else if(cmd == 'listCars')
{
	sm.getCars((_cars) =>
	{
		console.log(JSON.stringify(_cars, null, 4));
	}, errorHandler);
}
else if(cmd == 'listFuelings')
{
	if(process.argv.length < 6)
	{
		exitUsage();
	}
	else
	{
		var carId = process.argv[5];

		var limit = 5;
		if(process.argv.length > 6)
			limit = process.argv[6];

		sm.getFuelings(carId, limit, (_fuelings) =>
		{
			console.log(JSON.stringify(_fuelings, null, 4));
		}, errorHandler);
	}
}
else
{
	exitUsage();
}
