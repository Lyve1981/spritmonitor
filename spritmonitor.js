var req = require('./request.js');

/* If the API is used incorrectly, the API returns errors in JSON format. Example API error:
{
    "errors": 1,
    "errormessages": {
        "base": {
            "type": {
                "isEmpty": "Required entry"
            },
            "manuf": {
                "isEmpty": "Required entry"
            },
            "model": {
                "isEmpty": "Required entry"
            },
            "fuelconfig": {
                "isEmpty": "Required entry"
            },
            "modelname": {
                "isEmpty": "Required entry"
            },
            "gearing": {
                "isEmpty": "Required entry"
            },
            "constyear": {
                "isEmpty": "Required entry"
            },
            "power": {
                "isEmpty": "Required entry"
            }
        }
    }
}

If a call was successful, the response is:
{
    "errors": 0
}
*/

/*	getCars() returns an array, for each array entry you get car data.
	Example:
{
	"id": 123456,
	"make": "BMW",
	"model": "3er",
	"consumption": "5.67",
	"consumptionunit": "l/100km",
	"tripsum": "45678.00",
	"tripunit": "km",
	"quantitysum": "2345.67",
	"maintank": 1,
	"maintanktype": 1,
	"sign": "E AB 1234",
	"picture_ts": null,
	"bcconsumptionunit": "l/100km",
	"country": "D"
}
*/
exports.getCars = function(_success, _error)
{
	req.get("vehicles.json", _success, _error);
}

/*	getFuelings() returns an array of up to _limit fuelings for a car, specified by it's id.
	Example:
{
	"id": 33502891,
	"type": "full",
	"date": "12.04.2019",
	"odometer": "12345.00",
	"trip": "567.00",
	"fuelsortid": 20,
	"quantity": "15.55",
	"quantityunitid": 1,
	"quantity_converted": "15.55",
	"cost": "22.84",
	"currencyid": 0,
	"cost_converted": "22.84",
	"note": "My trip to the world of nodejs",
	"attributes": "summertires,normal",
	"streets": "autobahn,city,land",
	"consumption": "2.80",
	"bc_speed": "0.00",
	"bc_quantity": "0.00",
	"bc_consumption": "0.00",
	"position": null,
	"stationname": "Aral",
	"tankid": 1,
	"country": "D",
	"location": "Oberhausen"
},
*/
exports.getFuelings = function(_carId, _limit, _success, _error)
{
	// there are more parameters available, for example offset / date etc. Too lazy to add them
	// as my only purpose of this script is to be able to automatically add fuelings
	req.get("vehicle/" + _carId + "/fuelings.json?limit=" + _limit, _success, _error);
}

// getCompanies() returns all known fueling companies. The response should be rather static, I stored it at api_responses/companies.json for reference
exports.getCompanies = function(_success, _error)
{
	req.get("companies.json", _success, _error);
}

// getUnits() returns ids for various units used by the API. The response should be rather static, I stored it at api_responses/companies.json for reference
exports.getUnits = function(_success, _error)
{
	req.get("units.json", _success, _error);
}

// getCostTypes() returns ids for various units used by the API. The response should be rather static, I stored it at api_responses/costtypes.json for reference
exports.getCostTypes = function(_success, _error)
{
	req.get("costtypes.json", _success, _error);
}

// getFuelSorts() returns all known fuel sorts used by the API. The response should be rather static, I stored it at api_responses/fueltypes.json for reference
exports.getFuelSorts = function(_success, _error)
{
	req.get("fuelsorts.json", _success, _error);
}

// getVehicleConfigs() returns all manufacturers, vehicle types, fuel configurations, transmission types & board computer types known to the API.
// The response should be rather static, I stored it at api_responses/vehicletypes.json for reference
exports.getVehicleConfigs = function(_success, _error)
{
	req.get("vehicleconfigs.json", _success, _error);
}

// getCurrencies() returns all known currencies used by the API. The response should be rather static, I stored it at api_responses/currencies.json for reference
exports.getCurrencies = function(_success, _error)
{
	req.get("currencies.json", _success, _error);
}

// getQuantityUnits() returns all known quantity units used by the API. The response should be rather static, I stored it at api_responses/quantityunits.json for reference
exports.getQuantityUnits = function(_success, _error)
{
	req.get("quantityunits.json", _success, _error);
}

// some initialization functions to create some look-up tables. At the moment, only used by addFueling
var g_quantities = {};
var g_currencies = {};
var g_vehicleTypes = {};
var g_manufacturers = {};
var g_fuelConfigurations = {};
var g_transmissionTypes = {};
var g_boardcomputerUnits = {};
var g_fuelSorts = {};
var g_costTypes = {};
var g_companies = {};

var g_addFuelingInitialized = false;
var g_initialized = false;

exports.initializeAddFueling = function(_success, _error, _log)
{
	exports.getQuantityUnits((_res)=>
	{
		for(var i in _res)
		{
			var q = _res[i];
			g_quantities[q.name] = q;
			g_quantities[q.id] = q;
		}

		if(_log)		
			console.log("Quantities:\n" + JSON.stringify(g_quantities, null, 4));
		
		exports.getFuelSorts((_res)=>
		{
			for(var i in _res)
			{
				var f = _res[i];
				g_fuelSorts[f.name] = f;
				g_fuelSorts[f.id] = f;
			}
			if(_log)
				console.log("Fuel Sorts:\n" + JSON.stringify(g_fuelSorts, null, 4));

			exports.getCurrencies((_res)=>
			{
				for(var i in _res)
				{
					var c = _res[i];
					g_currencies[c.name] = c;
					g_currencies[c.id] = c;
				}
				
				if(_log)		
					console.log(JSON.stringify(g_currencies, null, 4));
				
				g_addFuelingInitialized = true;
				_success();
			}, _error);
		}, _error);
	}, _error);
}

exports.initialize = function(_success, _error, _log)
{
	exports.getVehicleConfigs((_res)=>
	{
		for(var i in _res.vehicletypes)
		{
			var v = _res.vehicletypes[i];
			g_vehicleTypes[v.name] = v;
			g_vehicleTypes[v.id] = v;
		}
		
		for(var i in _res.manufacturers)
		{
			var m = _res.manufacturers[i];
			g_manufacturers[m.name] = m;
			g_manufacturers[m.id] = m;
		}
		
		for(var i in _res.fuelconfiguration)
		{
			var f = _res.fuelconfiguration[i];
			g_fuelConfigurations[f.name] = f;
			g_fuelConfigurations[f.id] = f;
		}
		
		for(var i in _res.transmission)
		{
			var t = _res.transmission[i];
			g_transmissionTypes[t.name] = t;
			g_transmissionTypes[t.id] = t;
		}
		
		for(var i in _res.bcunit)
		{
			var b = _res.bcunit[i];
			g_boardcomputerUnits[b.name] = b;
			g_boardcomputerUnits[b.id] = b;
		}
		
		if(_log)
		{
			console.log("Vehicle Types:\n" + JSON.stringify(g_vehicleTypes, null, 4));
			console.log("Manufacturers:\n" + JSON.stringify(g_manufacturers, null, 4));
			console.log("Fuel Configurations:\n" + JSON.stringify(g_fuelConfigurations, null, 4));
			console.log("Transmission Types:\n" + JSON.stringify(g_transmissionTypes, null, 4));
			console.log("Board Computer Units:\n" + JSON.stringify(g_boardcomputerUnits, null, 4));
		}

		exports.getCostTypes((_res)=>
		{
			for(var i in _res)
			{
				var c = _res[i];
				g_costTypes[c.name] = c;
				g_costTypes[c.id] = c;
			}
			if(_log)
				console.log("Cost Types:\n" + JSON.stringify(g_costTypes, null, 4));
			
			exports.getCompanies((_res)=>
			{
				for(var i in _res)
				{
					var c = _res[i];
					g_companies[c.name] = c;
					g_companies[c.id] = c;
				}
				if(_log)
					console.log("Companies:\n" + JSON.stringify(g_companies, null, 4));
				exports.initializeAddFueling(() =>
				{
					g_initialized = true;
					_success()
				}, _error, _log);
			}, _error);
		}, _error);
	}, _error);
}

function formatDate(_date)
{
	// API wants dd.MM.yyyy

	var d = _date.getDate();
	var m = _date.getMonth() + 1;
	var y = _date.getFullYear();
	
	var dd = d < 10 ? ('0' + d) : (d);
	var MM = m < 10 ? ('0' + m) : (m);
	var yyyy = y;

	return dd + '.' + MM + '.' + yyyy;
}

exports.addFueling = function(_car, _params, _success, _error)
{
	var add = () =>
	{
		var date = formatDate(_params.date || new Date());
		var tank = _params.tank || 1;

		var p = 'date=' + date + '&type=' + (_params.type || 'full');									// either first, full, notfull or invalid
		
		if(_params.odometer > 0)		p += '&odometer=' + _params.odometer;							// either odometer or trip must be set
		else							p += '&trip=' + _params.trip;

										p += '&quantity=' + _params.quantity;

		if(_params.quantityunit)		p += '&quantityunitid=' + g_quantities[_params.quantityunit].id;

										p += '&fuelsortid=' + g_fuelSorts[_params.fuelsort].id;
										p += '&price=' + _params.price;
		
		if(_params.currency)			p += '&currencyid=' + g_currencies[_params.currency].id;

		if(_params.note)				p += '&note=' + encodeURIComponent(_params.note);				// Free text
		
		if(_params.streets)				p += '&streets=' + encodeURIComponent(_params.streets);			// any combination of autobahn,city,land separated by ,
		
		if(_params.attributes)			p += '&attributes=' + encodeURIComponent(_params.attributes);	// any combination of summertires,normal,ac,trailer,heating separated by ,
		
		if(_params.bc_consumption)		p += '&bc_consumption=' + _params.bc_consumption;	
		if(_params.bc_quantity)			p += '&bc_quantity=' + _params.bc_quantity;
		if(_params.bc_speed)			p += '&bc_speed=' + _params.bc_speed;

		if(_params.stationname)			p += '&stationname=' + encodeURIComponent(_params.stationname);	// Aral, Shell, Texaco, etc...
		if(_params.position)			p += '&position=' + _params.position.lat + ',' + _params.position.lon;
		else							p += '&position=null';

		if(_params.country)				p += '&country=' + encodeURIComponent(_params.country);			// D, EN, etc...
		if(_params.location)			p += '&location=' + encodeURIComponent(_params.location);		// e.g. city name, any string accepted

		var url = 'vehicle/' + _car + '/tank/' + tank + '/fueling.json?' + p;

		console.log("Adding fueling: " + url);

		req.get(url, (_res) =>
		{
			if(_res.errors === 0)
				_success(_res);
			else
				_error(_res);
		}, _error);
	}

	if(g_addFuelingInitialized)
		add();
	else
		exports.initializeAddFueling(add, _error, false);
}
