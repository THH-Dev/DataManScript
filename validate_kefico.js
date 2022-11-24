//test regex: https://regex101.com/
//doc: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match

const regex = /(F\d{14})$/g;
//const str_debug = 'F12232601529028';

// Default script for data formatting
function onResult (decodeResults, readerProperties, output)
{
	if (decodeResults[0].decoded)
	{
		//output.content = decodeResults[0].content;
		var found = decodeResults[0].content.match(regex);
		//var found = str_debug.match(regex);
		if(found != null)
		{
			output.content = decodeResults[0].content;
		}
		else
		{
			output.content = "NG_"+decodeResults[0].content;
			output.events.system = Event.system.validationFailure;
		}
	}
}
