exports.isLogin = function(req, res, next){
	if(req.session != null){
		if(req.session.userId){
			console.log("Sees on kasutaja: " + req.session.userId);
			next();
		} else {
			console.log("Sisse logimist pole tuvastud!")
			return res.redirect("/signin");
		}
	} else {
		console.log("Sisse logimist pole tuvastud!")
		return res.redirect("/signin");
	}
};