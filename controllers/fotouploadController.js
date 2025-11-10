const mysql = require("mysql2/promise");
const fs =  require("fs").promises;
const dbInfo = require("../../../vp2025config");
const sharp = require("sharp");
	
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu"
};

//@desc home page for gallery fotos
//@route GET /galleryfotoupload
//@access public
	
const fotouploadPage = (req, res)=>{	
	res.render("galleryfotoupload");
};

//@desc home page uploading fotos to gallery
//@route GET /galleryfotoupload
//@access public

const fotouploadPagePost = async (req, res) => {// võtab info ja saada POSTi
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName ="vp_" + Date.now() + ".jpg";
		console.log(fileName)
		await fs.rename(req.file.path, req.file.destination + fileName);
		// loon normaalsuuruse 800x600
		await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		//thumbnail 100x100
		await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO gallery_fotos (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)";
		//kuna kasutajakontosid pole, määrame userid = 1
		const userid = 1;
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userid]);
		res.render("galleryfotoupload");
	}
	catch(err){
		console.log(err);
		res.render("galleryfotoupload");
	}
	finally {
        if (conn) { // kui ühendus ON olemas:
			await conn.end(); // closes the DB connection
            console.log("Ühendus on suletud!");
		}
	}
}

module.exports = {
    fotouploadPage,
	fotouploadPagePost
}