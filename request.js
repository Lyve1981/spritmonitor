var https = require("https");

const g_host = "api.spritmonitor.de";
const g_port = 443;
const g_path = "/v1/";
const g_appId = "81699ea0a8cf1e252cbbf5e582f3aad3";
const g_apiLanguage = "en";
const g_userAgent = "Spritmonitor.de Android App (28) Samsung Galaxy S10"

const g_user = process.argv[2];
const g_pass = process.argv[3];

const g_authorization = "Basic " + Buffer.from(g_user + ':' + g_pass, 'UTF-8').toString('base64');

function doRequest(_method, _path, _callbackSuccess, _callbackError)
{
	var options =
	{
		hostname: g_host,
		port: g_port,
		path: g_path + _path,
		method: _method,
		headers: {
			'Authorization': g_authorization,
			'Application-Id': g_appId,
			'API-Language': g_apiLanguage,
			'User-Agent': g_userAgent
		}
	};

	const req = https.request(options, function(res)
	{
		res.setEncoding('utf8');
		
		var data = "";
		
		res.on('data', function(chunk)
		{
			data += chunk;
		});

		res.on('end', function()
		{
			try
			{
				_callbackSuccess(JSON.parse(data), res.headers);
			}
			catch(err)
			{
				console.log("JSON Parsing error for string " + data);
				_callbackError(err);
			}
		});
	});

	req.on('error', function(e)
	{
	  console.error('request error: ' + e.message);
	  _callbackError(e);
	});

	req.end();
}

exports.get = function(_path, _callbackSuccess, _callbackError)
{
	doRequest('GET', _path, _callbackSuccess, _callbackError);
}
