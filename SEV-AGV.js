var Perspective = 1;

// attach orientation to DataMatrix codes calculated through solid finder corner points
function onResult (decodeResults, readerProperties, output)
{
	if (decodeResults[0].decoded)
	{
//		output.content = decodeResults[0].content;
//debug
output.content = "";
		
		if(decodeResults[0].symbology.name == "Data Matrix" || decodeResults[0].symbology.name == "QR") // is a DataMatrix or QR code?
		{
			var ang1;
			if(Perspective){
				var m1x = (decodeResults[0].symbology.corners[1].x + decodeResults[0].symbology.corners[2].x)/2;
				var m1y = (decodeResults[0].symbology.corners[1].y + decodeResults[0].symbology.corners[2].y)/2;
				var m2x = (decodeResults[0].symbology.corners[0].x + decodeResults[0].symbology.corners[3].x)/2;
				var m2y = (decodeResults[0].symbology.corners[0].y + decodeResults[0].symbology.corners[3].y)/2;
				// right leg in 'L' orientation
				var x1 = m1x - m2x;
				var y1 = m1y - m2y;
				ang1 = Math.atan2(y1, x1) * (180 / Math.PI);
			}else{
				// right leg in 'L' orientation
				var x1 = decodeResults[0].symbology.corners[1].x - decodeResults[0].symbology.corners[0].x;
				var y1 = decodeResults[0].symbology.corners[1].y - decodeResults[0].symbology.corners[0].y;
				ang1 = Math.atan2(y1, x1) * (180 / Math.PI);
			}
//debug	
//ang1 = 0;
			if(ang1 < 0)
				ang1 += 360;
			
			var ang2;
			if(Perspective){
				var m3x = (decodeResults[0].symbology.corners[2].x + decodeResults[0].symbology.corners[3].x)/2;
				var m3y = (decodeResults[0].symbology.corners[2].y + decodeResults[0].symbology.corners[3].y)/2;
				var m4x = (decodeResults[0].symbology.corners[0].x + decodeResults[0].symbology.corners[1].x)/2;
				var m4y = (decodeResults[0].symbology.corners[0].y + decodeResults[0].symbology.corners[1].y)/2;
				// top leg in 'L' orientation
				var x2 = m3x - m4x;
				var y2 = m3y - m4y;
				ang2 = Math.atan2(y2, x2) * (180 / Math.PI);
			}else{			
				// top leg in 'L' orientation
				var x2 = decodeResults[0].symbology.corners[3].x - decodeResults[0].symbology.corners[0].x;
				var y2 = decodeResults[0].symbology.corners[3].y - decodeResults[0].symbology.corners[0].y;
				ang2 = Math.atan2(y2, x2) * (180 / Math.PI);
			}

//debug
//ang2 = 90;
			if(ang2 < 0)
				ang2 += 360;
			


			if(decodeResults[0].symbology.name == "Data Matrix"){
				// calculate angles, turn top leg towards right leg by +90°, and ensure positive angles
				ang2 += 90;
			}else if(decodeResults[0].symbology.name == "QR"){
				// calculate angles, turn top leg towards right leg by +270°, and ensure positive angles
				ang2 += 270;
			}

			if(ang2 >= 360)
				ang2 -= 360;		

//debug
//output.content += x1 + "    " + y1  + "    " ;
//output.content += x2 + "    " + y2  + "    " ;		
//output.content += "ang1: " + ang1 + "    " + "ang2: " + ang2;
		
			// average both angles and truncate decimal places
			var angle; 
			if(ang1 == 0 && ang2 < 360 && ang2 > 270){
				angle = ((360 + ang2) / 2);
		    }else if(ang2 == 0 && ang1 < 360 && ang1 > 270){
				angle = ((ang1 + 360) / 2);
		    }else if(ang1 > 0 && ang1 < 45 && ang2 < 360 && ang2 > 270){
				angle = ((ang1 + 360) + ang2) / 2;
			}else if(ang2 > 0 && ang2 < 45 && ang1 < 360 && ang1 > 270){
				angle = (ang1 + (ang2 + 360)) / 2;
			}else{
				angle = ((ang1 + ang2) / 2);
			}
			
			if(angle >= 360)
				angle -= 360;
			angle = Number(angle).toFixed(2);
			 
//debug
//output.content += "     " + "OrgAngle: " + decodeResults[0].symbology.angle + "     " + "CalAngle: " + angle;
			
			var spacer = ", ";
			var center = decodeResults[0].symbology.center.x + spacer + decodeResults[0].symbology.center.y
			output.content += "\02" + decodeResults[0].content + spacer + center + spacer + angle + "\03";
		}
	}
}
