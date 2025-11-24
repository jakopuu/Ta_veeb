const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const dbInfo = require("../../../vp2025config");

	
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu"
};

//@desc home page for signup
//@route GET /signup
//@access public
	
const signupPage = (req, res)=>{	
	res.render("signup", {notice: "Ootan andmeid!"});
};

//@desc home page creating user account, signup
//@route GET /signup
//@access public

const signupPagePost = async (req, res) =>{// võtab info ja saada POSTi
	let conn;
	let notice = "";
	console.log(req.body);
	//andmete valideerimine
	if(
	!req.body.firstNameInput ||
	!req.body.lastNameInput ||
	!req.body.birthDateInput ||
	!req.body.genderInput ||
	!req.body.emailInput ||
	req.body.passwordInput.length < 8 ||
	req.body.passwordInput !== req.body.confirmPasswordInput
	){
		let notice = "Andmeid on puudu, v6i miskit on viga!";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
	try {
		conn = await mysql.createConnection(dbConf);
		
		let sqlReq = "SELECT id from users WHERE email = ? ";
		const [users] = await conn.execute(sqlReq, [req.body.emailInput])
		if (users.length > 0){
			notice ="Selline kasutaja on juba olemas";
			console.log(noticce);
			return res.render("signup", {notice: notice})
		}
		//krypteerime parooli
		const pwdHash = await argon2.hash(req.body.passwordInput) 
		//console.log(pwdHash);
		//console.log(pwdHash.length);
		sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender , email , password) VALUES (?,?,?,?,?,?)";
		const [result] = await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.birthDateInput,
			req.body.genderInput,
			req.body.emailInput,
			pwdHash
			]);
		console.log("Salvestati kasutaja: " + result.insertId);
		res.render("signup", {notice: "Kõik on hästi"});
	}
	catch(err){
		console.log(err);
		res.render("signup", {notice: "Tehniline viga"});
	}
	finally {
        if (conn) { // kui ühendus ON olemas:
			await conn.end(); // closes the DB connection
            console.log("Ühendus on suletud!");
		}
	}
}

module.exports = {
    signupPage,
	signupPagePost
}