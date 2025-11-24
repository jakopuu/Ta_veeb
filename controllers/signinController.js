const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const dbInfo = require("../../../vp2025config");

	
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu"
};

//@desc home page for signin
//@route GET /signin
//@access public
	
const signinPage = (req, res)=>{	
	res.render("signin", {notice: "Sisesta kasutajatunnus ja parool"});
};

//@desc page for signin
//@route GET /signin
//@access public

const signinPagePost = async (req, res) =>{// võtab info ja saada POSTi
	let conn;
	console.log(req.body);
	//andmete valideerimine
	if(
	!req.body.emailInput ||
	!req.body.passwordInput
	){
		let notice = "Andmeid on puudulikud!";
		console.log(notice);
		return res.render("signin", {notice: notice});
	}
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT id, password FROM users WHERE email = ?";
		const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		//Kas sellise emailiga kasutaja leiti
		if(users.length === 0){
			return res.render("signin", {notice : "Kasutaja tunnus ja/või parool on vale!"});
		}
		
		const user = users[0];
		
		//parooli kontroll
		const match = await argon2.verify(user.password, req.body.passwordInput)
		if(match){
			//logisime sisse
			//return res.render("signin", {notice : "Oledki sees!"});
			
			//paneme sessiooni k2ima ja m22rame sessiooni yhe muutuja
			req.session.userId = user.id;
			sqlReq = "SELECT first_name, last_name FROM users WHERE id =? ";
			const [users] = await conn.execute(sqlReq, [req.session.userId]);
			req.session.firstName = users[0].first_name;
			req.session.lastName = users[0].last_name;
			return res.redirect("/home");
			
		} else{
			//parool oli vale
			console.log("Vale parool!")
			return res.render("signin", {notice : "Kasutaja tunnus ja/või parool on vale!"});
		}
			
	}
	catch(err){
		console.log(err);
		res.render("signin", {notice: "Tehniline viga"});
	}
	finally {
        if (conn) { // kui ühendus ON olemas:
			await conn.end(); // closes the DB connection
            console.log("Ühendus on suletud!");
		}
	}
}

module.exports = {
    signinPage,
	signinPagePost
}