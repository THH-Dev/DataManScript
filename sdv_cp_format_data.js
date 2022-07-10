// Default script for data formatting tuanna
function onResult (decodeResults, readerProperties, output)
{
	if (decodeResults[0].decoded)
	{
		var decode_time = decodeResults[0].decodeTime;
		var score = decodeResults[0].metrics.overallGrade.grade;
		var center_code = decodeResults[0].symbology.center;
		
		var ROI_top_left = {	x:decodeResults[0].image.RoI.left,
								y:decodeResults[0].image.RoI.top
						};
		
		var distance = myFunction(center_code, ROI_top_left).toFixed(0); //toFixed ~ lam tron thap phan

		output.content = "{0}_{1}_{2}_{3}".format(decodeResults[0].content,
												zeroPad(decode_time,4),
												score,
												distance);
	}
	else
	{
		output.content = "EnGi";
	}
}

//format string
String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

//log point
function Point2string(p1) {
  return "x={0}, y={1}".format(p1.x, p1.y);
}

//euclid distance between two point
function myFunction(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}


//pading zero
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

