const express = require("express");
const fs = require("fs");
const dateET = require("./src/dateTimeET.js");
const bodyparser = require("body-parser");
//Kuna kasutame asünkroonsust, siis impordime mysql2/promise mooduli
//const mysql = require("mysql2/promise");
//const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
const textRef2 = "public/txt/visitlog.txt"
//k2ivitan express.js funktsiooni ja annan talle nime "app"
const app = express();
//m22ran veebilehtede mallide renderdamise mootorit
app.set("view engine", "ejs");
//m22ran yhe p2ris kataloogi avalikult k2ttesaadavaks
app.use(express.static("public"));
//kui tuleb vormist ainult tekst siis false aga kui muud siis true
app.use(bodyparser.urlencoded({extended: true}));

/*const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu"
};*/

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
app.get("/", async (req, res) => {
    let conn;
    let sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)";
    const privacy = 3;
    try {
        conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute(sqlReq, [privacy])
        console.log(rows);
        res.render("index", { photoList: rows }); 
    }
    catch(err) {
        console.log("ERROR!" + err);
        res.render("index", { photoList: [] });
    }
    finally {
        if (conn) { 
            await conn.end(); 
            console.log("Ühendus on suletud!");
        }
    }
})

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

//galerii fotode üleslaadimine

const fotoupRouter =require("./routes/fotoupRoutes");
app.use("/galleryfotoupload", fotoupRouter);



//Eesti filmi marsuudid 
const eestiFilmRoutes = require("./routes/eestiFilmRoutes");
app.use ("/Eestifilm", eestiFilmRoutes);


app.listen(5107);