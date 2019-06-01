<h1>Spritmonitor command line API wrapper</h1>

This is a small node.js program that I created to be able to automatically add fuelings to Spritmonitor
after having charged my car.

This is far from complete, but enough for my needs.

__Usage__

`node spritmonitor_cmd.js username password addFueling|listCars|listFuelings`
  * *addFueling* required options:
    * quantity=56.78
    * price=67.89
    * fuelsort=Diesel|Super gasoline|Electricity|... (see fueltypes.json)
    * Either:
      * odometer=67890 for total mileage/kilometers of the car
    * Or:
      * trip=678 for distance of trip since last refueling
  * addFueling additional options (all optional):
    * quantityunit=l|US.gal|kg|kWh|... (see quantityunits.json)
    * currency=EUR|USD|... (see currencies.json)
    * "note=Your custom message"
    * streets=autobahn,city,land (any combination of these, separated by comma)
    * attributes=summertires,normal (any of summertires|wintertires,normal|slow|fast,ac,trailer,heating)
    * bc_consumption=7.65 (consumption as indicated by the board computer)
    * bc_quantity=47.65 (quantity as indicated by the board computer)
    * bc_speed=76 (average trip speed as indicated by the board computer)
    * stationname=Aral|Shell|... (see fuelingcompanies.json)
    * position=55.555,7.7777 (position as latitude,longitude)
    * country=D (two letters country code)
    * location=Hamburg (location name, for example city name)
    * tank=1|2 (fuel tank id, regular cars only have 1, hybrid cars 1=gasoline, 2=electricity)
    * date=03/21/2019|21.03.2019 (any date that can be parsed, note that hour/min/sec is not supported
                                by the API and will be ignored)
  * listCars: no options required, returns json of all cars available
  * listFuelings: carId [limit=number] returns last limit fuelings as json
