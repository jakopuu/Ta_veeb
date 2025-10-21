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
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	else{
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

const filmPositionAdd = (req, res) => { 
    console.log(req.body);
    res.render("filmi_positions_add", { notice: "Ootan sisestust!" });
}

const position = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM position"; // teeb SQL päringu minu andmebaasile, tavalised SQL commandid
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Ühendus loodud!");
        const [rows, fields] = await conn.execute(sqlReq); // saadab selle ülevalpool nimetatud asja (sqlReq const) välja, salvestab selle massiivi! rows ja fields, kuna tegemist on SELECT käsuga
        res.render("film_positions", { positionList: rows });
    }
    catch (err) {
        console.error("SQL query error:", err);
        res.render("film_positions", { positionList: [] });

    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Ühendus on suletud!");
        }
    }
};




const filmPositionAddPost = async (req, res) => { // võtab info ja saada POSTi
    console.log(req.body);
    let conn; // connection
    let sqlReq = "INSERT INTO position (position_name, description) VALUES (?, ?)"; // küsimärgid märgivad saadetavaid andmeid, nii palju kui vajalikke andmeid, nii palju küsimärke
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Ühendus loodud!");
        const [result] = await conn.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput]); // kuna tuleb palju andmeid tagasi, siis on result massiiv
        console.log("Salvestati kirje: " + result.insertId); // saame teada selle äsja lisatud kirje ID
        await res.redirect("/Eestifilm/film_positions");
    }
    catch (err) {
        throw (err);
    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Ühendus on suletud!");
        }
    }
}

const movies = async (req, res) => {
	let conn;
    const sqlReq = "SELECT * FROM movie";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Ühendus loodud!");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("movies", { movieList: rows });
    }
    catch (err) {
        console.error("ERROR!", err);
        res.render("movies", { movieList: [] });

    }
    finally {
        if (conn) { // kui ühendus ON olemas:
            await conn.end(); // closes the DB connection
            console.log("Ühendus on suletud!");
        }
    }
};

const moviesGet = (req, res) => { // näitab tühja form-i
    console.log(req.body);
    res.render("movies_add", { notice: "Ootan sisestust!" });
}

const movieAddPost = async (req, res) => { 
    console.log(req.body);
    let movieDescription = null;
    let conn;
    let sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?, ?, ?, ?)"; 
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Ühendus loodud!");
        if (req.body.movieDescription != "") {
            movieDescription = req.body.movieDescriptionInput;
        }
        const [result] = await conn.execute(sqlReq, [req.body.movieNameInput, req.body.movieProductionYearInput, req.body.movieLengthInput, req.body.movieDescriptionInput]); 
        console.log("Salvestati kirje: " + result.insertId); 
        await res.redirect("/Eestifilm/movies");
    }
    catch (err) {
        throw (err);
    }
    finally {
        if (conn) { 
            await conn.end(); 
            console.log("Ühendus on suletud!");
        }
    }
}

module.exports = {
    eestifilm,
    inimesed,
    inimesedAdd,
    inimesedAddPost,
    position,
    filmPositionAdd,
    filmPositionAddPost,
    movies,
    moviesGet,
    movieAddPost
}