const express = require("express");
const fs = require("fs");
const dateET = require("./src/dateTimeET.js");
const bodyparser = require("body-parser");
const dbInfo = require("../../vp2025config");
const loginCheck = require("./src/checklogin");
const mysql = require("mysql2/promise");
const session = require("express-session");
//Kuna kasutame asünkroonsust, siis impordime mysql2/promise mooduli
const textRef = "public/txt/vanasonad.txt";
const textRef2 = "public/txt/visitlog.txt"
//k2ivitan express.js funktsiooni ja annan talle nime "app"
const app = express();
app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: true}));
//m22ran veebilehtede mallide renderdamise mootorit
app.set("view engine", "ejs");
//m22ran yhe p2ris kataloogi avalikult k2ttesaadavaks
app.use(express.static("public"));
//kui tuleb vormist ainult tekst siis false aga kui muud siis true
app.use(bodyparser.urlencoded({extended: true}));

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu"
};

app.get("/", async (req, res) => {
  let conn;
  const sqlLatestPublic = "SELECT filename, alttext FROM gallery_fotos WHERE id=(SELECT MAX(id) FROM gallery_fotos WHERE privacy=? AND deleted IS NULL)";

  try {
    conn = await mysql.createConnection(dbConf);
    const [rows] = await conn.execute(sqlLatestPublic, [3]);
    const photoName = rows.length ? rows[0].filename : null;
	
	res.render("index", { photoName });
  } catch (err) {
    console.error(err);
    res.render("index", { photoName: null });
  } finally {
    if (conn) {
      await conn.end();
      console.log("Ühendus on suletud!");
    }
  }
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

app.get("/home", loginCheck.isLogin, (req,res)=>{
	console.log("Sisse logis kasutaja " + req.session.userId);
	res.render("home", {user: req.session.firstName + " " + req.session.lastName});
});

//v2lja logimine
app.get("/logout", (req,res)=>{
	//tyhistame sessiooni
	req.session.destroy();
	console.log("v2lja logitud");
	res.redirect("/");
});

//galerii fotode üleslaadimine

const fotoupRouter =require("./routes/fotoupRoutes");
app.use("/galleryfotoupload", fotoupRouter);

//Eesti filmi marsuudid 
const eestiFilmRoutes = require("./routes/eestiFilmRoutes");
app.use ("/Eestifilm", eestiFilmRoutes);

const galleryRouter = require("./routes/fotogalRoutes");
app.use("/fotogallery", galleryRouter);

//const newsRouter = require("./routes/newsRoutes");
//app.use("/news", newsRouter);

//konto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

//sisse logimise marsuudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5107);