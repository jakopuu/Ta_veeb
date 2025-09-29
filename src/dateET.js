//function dateNowFormattedET()
exports.dateNowFormattedET = function(){
	let timeNow = new Date();
    const dayNamesET = ["pühapäev" , "esmaspäev" , "teisipäev" , "kolmapäev" , "neljapäev" , "reede" , "laupäev" ];
	const monthNamesET =["jaanur", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	//return dateNow + "." + (monthNow + 1) + "." + yearNow;
	return dayNamesET[timeNow.getDay()] + " " + timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();