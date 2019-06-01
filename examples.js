var sm = require('./spritmonitor.js')

function errorHandler(_err)
{
	console.log("ERROR: " + JSON.stringify(_err) + _err);
}

sm.getCars((_cars) =>
{
	console.log("Cars:\n" + JSON.stringify(_cars, null, 4));
	
	for(var i in _cars)
	{
		var car = _cars[i];

		console.log("Car ID: " + car.id + "\n" + JSON.stringify(car,null,4));
		
		sm.getFuelings(car.id, 5, (_fuelings) =>
		{
			console.log("Last five fuelings for car " + car.make + " " + car.model + ":\n" + 
			JSON.stringify(_fuelings, null, 2));
		}, () => {});
	}
},
errorHandler);

sm.getUnits((_units) =>
{
	console.log("Units:\n" + JSON.stringify(_units, null, 4));
},
errorHandler);

sm.getCompanies((_companies) =>
{
	console.log("Companies:\n" + JSON.stringify(_companies, null, 4));
},
errorHandler);

sm.getFuelSorts((_fuelsorts) =>
{
	console.log("Fuel Sorts:\n" + JSON.stringify(_fuelsorts, null, 4));
},
errorHandler);

sm.getCostTypes((_fuelsorts) =>
{
	console.log("Cost Types:\n" + JSON.stringify(_fuelsorts, null, 4));
},
errorHandler);

sm.getCurrencies((_currencies) =>
{
	console.log("Currencies:\n" + JSON.stringify(_currencies, null, 4));
},
errorHandler);

sm.getQuantityUnits((_res) =>
{
	console.log("Quantity Units:\n" + JSON.stringify(_res, null, 4));
},
errorHandler);

sm.addFueling(123456,
{
    "note": "Automatic entry from NodeJS",
    "fuelsort": "Diesel",
    "currency": "EUR",
    "position": {
        "lat": "55.55555",
        "lon": "6.66666"
    },
    "country": "D",
    "location": "Hamburg",
    "odometer": "87654",
    "quantity": "12.34",
    "price": "23.45",
    "date": new Date()
}, (_success) =>
{
	console.log("Successfully added fueling");
}, errorHandler);
