const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jakopuu"
};

//@desc home page for photogallery
//@route GET /photogallery
//@access public

const galleryHome = async (req, res)=>{

	res.redirect("/fotogallery/1")
}; 

const galleryPage = async (req, res)=>{
	let conn;
	const fotoLimit = 4;
	const privacy = 2;
	let page = parseInt(req.params.page);
	let skip = 0;
	
	try {
		//kontroll, et ei oleks page miinuses
		if (page < 1 || isNaN(page)){
			page =1;
		}
		//vaatame, mitu pilti on
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT COUNT (id) AS fotos FROM gallery_fotos WHERE privacy >= ? AND deleted is NULL"
		const [countResult] =  await conn.execute(sqlReq, [privacy]);
		const fotoCount = countResult[0].fotos;
		//parandame lehekylje numbri kui valik on liiga suur
		if ((page-1)*fotoLimit >= fotoCount){
			page = Math.max(1, Math.ceil(fotocount/fotoLimit));
		}
		skip = (page - 1)* fotoLimit
		
		if(page === 1){
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;";
		}else {
			galleryLinks = `<a href="/fotogallery/${page-1}">Eelmine leht </a>&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;`;
		}
		if(page * fotoLimit >= fotoCount){
			galleryLinks += "Järgmine leht";
		}else {
		galleryLinks += `<a href="/fotogallery/${page+1}">Järgmine leht </a>&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; `;
		}
		
		
		sqlReq = "SELECT filename, alttext FROM gallery_fotos WHERE privacy >= ? AND deleted IS NULL LIMIT ?,?";
		const [rows, fields] = await conn.execute(sqlReq, [privacy,skip, fotoLimit ]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altTtext = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alttext;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("fotogallery", {galleryData: galleryData, imagehref:"/gallery/thumbs/", links:galleryLinks});
	}
	catch(err){
		console.log(err);
		res.render("fotogallery", {galleryData: galleryData, imagehref:"/gallery/thumbs/", links:""});
	}
	finally {
	  if(conn){
	    await conn.end();
	    console.log("Ühendus on suletud!");
	  }
	}
};

module.exports = {
	galleryHome,
	galleryPage
};