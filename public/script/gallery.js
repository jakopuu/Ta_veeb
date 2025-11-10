window.onload = function(){
	//kÃ¤in lehe lÃ¤bi ja teen listi kÃµigist thumbs klassiga pisipiltidest
	let allThumbs = document.querySelector("#gallery").querySelectorAll(".thumbs");
	//mÃ¤Ã¤ran kÃµigile funktsiooni, mis kÃ¤ivitatakse hiireklikiga
	for (let i = 0; i < allThumbs.length; i ++){
		allThumbs[i].addEventListener("click", openModal);
	}
	document.querySelector("#modalClose").addEventListener("click", closeModal);
	document.querySelector("#modalImage").addEventListener("click", closeModal);
}

function openModal(e){
	document.querySelector("#modalImage").src = "/gallery/normal/" + e.target.dataset.filename;
	document.querySelector("#modalCaption").innerHTML = e.target.alt;
	document.querySelector("#modal").showModal();
}

function closeModal(){
	document.querySelector("#modal").close();
	document.querySelector("#modalImage").src = "/images/empty.png";
	document.querySelector("#modalCaption").innerHTML = "galeriipilt";
}