const express = require("express");
const fs = require("fs");
const dateET = require("./src/dateTimeET.js");
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
const textRef2 = "public/txt/visitlog.txt"
//k2ivitan express.js funktsiooni ja annan talle nime "app"
const app = express();
//m22ran veebilehtede mallide renderdamise mootorit
app.set("view engine", "ejs");
//m22ran yhe p2ris kataloogi avalikult k2ttesaadavaks
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));

const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu",
});

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
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile(textRef2, "utf8", (err, data)=>{
		if(err){
			res.render("visitlog",{heading: "Külastajate ajalugu", listData: ["ei leidnud ühtegi külastajat!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("visitlog",{heading: "Külastajate ajalugu", listData: correctListData});
		}
	});
});

app.get("/Eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/Eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err,sqlres)=>{
		if (err){
			throw(err);
		}
		else {
			console.log(sqlres)
			res.render("filmiinimesed", {personList: sqlres});
		}
	});
	//res.render("filmiinimesed");
});

app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});
app.post("/Eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body)
	//kas andmed on olemas
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date || req.body.deceasedInput <= new Date()){
		res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	else{
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)"
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput],(err,sqlres)=>{
			if (err){
				res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
			}
			else{
				res.render("filmiinimesed_add", {notice: "Andmete salvestamine õnnestus"});
			}
		});
	};
});

app.get("/Eestifilm/filmid", (req, res)=>{
	const sqlReq2 = "SELECT * FROM movie";
	conn.execute(sqlReq2, (err,sqlres)=>{
		if (err){
			throw(err);
		}
		else {
			console.log(sqlres)
			res.render("filmid", {movieList: sqlres});
		}
	});
	//res.render("filmiinimesed");
});

app.listen(5107);