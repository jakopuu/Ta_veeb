const express = require("express");
const fs = require("fs");
const dateET = require("./src/dateTimeET.js");
const bodyparser = require("body-parser");
const textRef = "public/txt/vanasonad.txt";
const textRef2 = "public/txt/visitlog.txt"
//k2ivitan express.js funktsiooni ja annan talle nime "app"
const app = express();
//m22ran veebilehtede mallide renderdamise mootorit
app.set("view engine", "ejs");
//m22ran yhe p2ris kataloogi avalikult k2ttesaadavaks
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));
app.get("/", (req, res)=>{
	//res.send("Express.js l2ks k2ima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateET.weekDay();
	const dateNow = dateET.fullDate();
	const fullTime = dateET.fullTime();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow, fullTime: fullTime });
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			res.render("genlist",{heading: "Valik Eesti vanasõnad", listData: ["ei leidnud ühtegi vanasõna!"]});
		}
		else {
			folkWisdom = data.split(";");
			res.render("genlist",{heading: "Valik Eesti vanasõnad", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	const weekDayNow = dateET.weekDay();
	const dateNow = dateET.fullDate();
	const fullTime = dateET.fullTime();
	console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput +" "+ req.body.lastNameInput +" "+ " kell " +" "+ fullTime +" "+ weekDayNow +" "+ dateNow + ";", (err)=>{
				if(err){
					throw(err);
				}
				else{
					console.log("Salvestatud!");
					res.render("regvisit");
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let visitHistory = [];
	fs.readFile(textRef2, "utf8", (err, data)=>{
		if(err){
			res.render("visitlog",{heading: "Külastajate ajalugu", listData: ["ei leidnud ühtegi külastajat!"]});
		}
		else {
			visitHistory = data.split(";");
			res.render("visitlog",{heading: "Külastajate ajalugu", listData: visitHistory});
		}
	});
});
app.listen(5107);