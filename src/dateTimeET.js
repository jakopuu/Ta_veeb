//function dateNowFormattedET()

const dateNowFormattedET = function(){
	let timeNow = new Date();
    const dayNamesET = ["pühapäev" , "esmaspäev" , "teisipäev" , "kolmapäev" , "neljapäev" , "reede" , "laupäev" ];
	const monthNamesET =["jaanur", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	//return dateNow + "." + (monthNow + 1) + "." + yearNow;
	return dayNamesET[timeNow.getDay()] + " " + timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}
	
const timeNowFormattedET = function(){
	let timeNow = new Date();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
	}
	
const partOfDay = function(){
	let dayPart = "suvaline aeg";
	let hourNow = new Date().getHours();
		if(hourNow <= 6){
			dayPart = "varahommik";
		} else if (hourNow < 12){
			dayPart = "hommik";
		} else if (hourNow == 12){
			dayPart = "keskpäev";
		}
	return dayPart;
	}

	//ekspordin vajaliku
	module.exports = {fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, dayPart: partOfDay };
