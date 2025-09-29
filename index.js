const express = require("express");
const fs = require("fs");
const dateET = require("./src/dateTimeET.js");
const bodyparser = require("body-parser");
const textRef = "public/txt/vanasonad.txt";
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

app.get("/timenow", (req, res) =>{
	const weekDayNow = dateET.fullDate();
res.render("timenow", {weekDayNow: weekDayNow,});
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
	console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + "; ", (err)=>{
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
app.listen(5107);