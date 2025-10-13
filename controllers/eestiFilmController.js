const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");
//app.get("/Eestifilm", (req, res)=>{
	
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu"
};

//@desc home page for Estonian film section
//@route GET /Eestifilm
//@access public
	
const eestifilm = (req, res)=>{	
	res.render("eestifilm");
};
//@desc page list for people involved in Estonian film industry
//@route GET /inimesed
//@access public

//app.get("/Eestifilm/inimesed", async (req, res)=>{
const inimesed = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Ühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err){
		console.log("ERROR!" + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally{
		if(conn){
			await conn.end();
			console.log("Ühendus on suletud!");
		}
	}
};

//@desc page adding for people involved in Estonian film industry
//@route GET /Eestifilm/inimesed
//@access public

//app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
const inimesedAdd = (req, res)=>{
res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};

//@desc POST page list for people involved in Estonian film industry
//@route POST /Eestifilm/inimesed_add
//@access public

//app.post("/Eestifilm/filmiinimesed_add", async (req, res)=>{
const inimesedAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)"
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date || req.body.	deceasedInput <= new Date()
		res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	)else{
		try{
			conn = await mysql.createConnection(dbConf);
			console.log("Ühendus loodud!");
			let deceased = null;
			if (req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] =  await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
		}
		catch(err){
			console.log("ERROR!"+ err)
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
		}
		finally{
			if(conn){
			await conn.end();
				console.log("Andmebaasi[hendus on suletud");
			}
		}
	};
};

module.exports ={
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost
	}