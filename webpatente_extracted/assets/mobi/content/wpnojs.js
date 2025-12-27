// Variabili per la versione JavaScript

var sext = "mp3"                         //Estensione effetti sonori
var percsuoni=presuoni+"suonimp3/"	     //Percorso della cartella degli effetti sonori  (suoni/ per versione xul)

var prefimg=pregrafica+"../immagini/s";  //Percorso delle figure
//var prefimg="immagini/s"

var perpers=""                           //Non usato nella versione js

var percaudio=presuoni+ "../audio/"
var audioloc = new Array(); // Non usato nella versione js ma va definito

// ----------------------------------------------------

function finattiva(fin){
	//Questa funzione non fa nulla nella versione js
}

// Wrappers delle funzioni per la versione JS
function esame(){
	nuovoesame()
}
function argo(numquiz){
	nuovoargo(numquiz)
}
function soluzioni(numquiz){
	nuovasolu(numquiz)
}
function risultati(tab){
	mostraris(tab)
}
/*
function opzioni(div,gruppo){
	//op.mostra('opzioni1')
	mostraopz(div,gruppo)
}
*/
function opzioni(tab){
	mostraopz(tab)
}	
function esito(){
	schedaesame.esito()	
}
function sugge(){
	getWin(winsugg,'pansugg').innerHTML=suggerimento.testo+testipla+aiuto+"</div>"; // Questo div è necessario
	pansugg.setTitle(suggerimento.titolo);
}
function suggeC(){
	getWin(winsugg,'pansugg').innerHTML=LZString.decompress(suggerimento.testo)+testipla+aiuto+"</div>"; // Questo div è necessario
	pansugg.setTitle(suggerimento.titolo);
}
function lezione(numlez){
	nuovalez(numlez)
}
function argoesame(){
	mostraesargo()
}
function errori(){
	mostraerrori()
}

function getWin(win,id){
	// Ignora win perchè la finestra è unica
	return document.getElementById(id)
}

function rimuoviscript(sid){
	oldjs=document.getElementById(sid)
 	if (oldjs!=null) {
 		document.body.removeChild (oldjs);
 	}
} 

function creascript(sid,ssrc,async){
  	sh = document.createElement('SCRIPT');
  	sh.setAttribute("type","text/javascript");
  	sh.setAttribute("id",sid);
  	sh.setAttribute("src",ssrc);
  	if (async!=null) sh.setAttribute("async","async");
  	document.body.appendChild(sh) 
  	return sh;  	
}	
function creacss (cid, chref){
  	var c = document.createElement('LINK');
	c.setAttribute("type","text/css");
	c.setAttribute("id",cid);
	c.setAttribute("rel","stylesheet");
	c.setAttribute("href",chref)
	document.getElementsByTagName("head")[0].appendChild(c)
  	return c;  	
}
function rimuovicss(cid){
	oldc=document.getElementById(cid)
 	if (oldc!=null) {
 		document.getElementsByTagName("head")[0].removeChild (oldc);
 	}
} 
if (typeof openbrowser!="function"){
function openbrowser(urltogo){
	open(urltogo, "_blank")
}
}
function commuta(p,s){
	return eval(p+".commuta('"+s+"')")
}

function aggiornabanner(){
	//return
	if (persinfo==null) {// Il banner non si aggiorna nelle personalizzazioni
		document.getElementById('banspa').src=ban
	}	
}

function finaiuto(){
	winpv.show()
}

function setTooltip(win,id,t){
	dum=getWin(win,id)
	if (dum!=null) dum.setAttribute("title",t) //imposta l'attributo via dom
}


function salva(wp4url,filfor){
	off_salva(wp4url,filfor) // Si trova in index.htm o in versioni.js - gestisce anche la versione online
}
function consolemsg(str){
	if (offtype=="xul"){
		Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService).logStringMessage(str);
	}else{
		console.log(str)
	}	
}
