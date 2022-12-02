// Default script for data formatting
function onResult (decodeResults, readerProperties, output)
{
	if(!decodeResults[0].decoded)
	{
		output.content = "NG\r\n";
		return;
	}
	
	//process data
	const array_data_code = [];
	for(var i =0; i < decodeResults.length; i++)
	{
		array_data_code[i] =  decodeResults[i].content;
	}
	
	if (array_data_code.length > 0)
	{
		//output.content = decodeResults[0].content;
		var found = array_data_code.join(",");
		output.content = found + "\r\n";
	}
	else
	{
			output.content = array_data_code.length + "NG\r\n";
	}
	

}