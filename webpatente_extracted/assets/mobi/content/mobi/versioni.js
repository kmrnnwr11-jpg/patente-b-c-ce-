// WEBpatente 4.4 - MOBI
var offtype="html"
if (typeof interjs!='undefined') offtype="andro" //<-- INDENTIFICA ANDROID
var autopers=false;

function lz(numero, cifre) {
	var n = String(numero);
	while (n.length<cifre) { 
		n="0"+n 
	}
	return n;
}
function modiDate(){
	var d=new Date(document.lastModified)
	if (offtype=="andro"){
	 	try{
 			var ds=interjs.ritornadatacomp()
 		} catch(err){
 			var ds=lz(d.getDate(),2)+"/"+lz(d.getMonth()+1,2)+"/"+lz(d.getFullYear(),4)
 		}
	}else
	 	var ds=lz(d.getDate(),2)+"/"+lz(d.getMonth()+1,2)+"/"+lz(d.getFullYear(),4)
 	return ds
}	
	
function tversion(app,pri,sec,rev,stato,abb,ext,pat,info,mobi){
	this.app=app;
	this.pri=pri;
	this.sec=sec;
	this.rev=13;
	this.stato=stato;
	this.abb=abb;
	this.ext=ext;
	this.pat=pat;
	this.info=info;
	this.mobi=mobi;
	this.data=modiDate()
	this.show=function(){
		return this.stato+" "+this.pri+"."+this.sec+" rev. "+this.rev+" rilasciata il "+this.data+". Versione dei quiz: "+this.verquiz;
	}
}

var patidx    ="../";
var persidx   ="../pers/";
var pat= [];	
pat['ab']     ={nome:"A e B",perc:"../quiz-ab/",onlinen:"/nuoviquiz-patente-b/mobi/",online:"/quiz-patente-b/mobi/"};
pat['abrev']  ={nome:"A e B Revisione",perc:"../quiz-abrev/",online:"/quiz-patente-b-rev/mobi/",onlinen:"/nuoviquiz-patente-b-rev/mobi/"};
pat['am']     ={nome:"AM",perc:"../quiz-am/",onlinen:"/nuoviquiz-patente-am/mobi/",online:"/quiz-patente-am/mobi/"};
pat['c1c1e']  ={nome:"C1 e C1E",perc:"../quiz-c1c1e/",online:"/quiz-patente-c1c1e/mobi/"};
pat['c1c1enp']={nome:"C1 e C1E Non Professionali",perc:"../quiz-c1c1enp/",online:"/quiz-patente-c1c1enp/mobi/"};
pat['cce']    ={nome:"C e CE",perc:"../quiz-cce/",online:"/quiz-patente-cce/mobi/"};
pat['cceest'] ={nome:"Estensione C e CE",perc:"../quiz-cceest/",online:"/quiz-patente-cceest/mobi/"};
pat['d1d1e']  ={nome:"D1 e D1E",perc:"../quiz-d1d1e/",online:"/quiz-patente-d1d1e/mobi/"};
pat['dde']    ={nome:"D e DE",perc:"../quiz-dde/",online:"/quiz-patente-dde/mobi/"};
pat['ddeest'] ={nome:"Estensione D e DE",perc:"../quiz-ddeest/",online:"/quiz-patente-ddeest/mobi/"};

var offline=(document.location.protocol.substr(0,4)!='http')?true:false;
var prot = (offline)?"http:":(document.location.protocol)

preloadImages = function() {
	for (var i = 0; i < arguments.length; i++) {
    	//(new Image()).src= arguments[i]
   		var img=new Image()
   		img.src=arguments[i]
 	}
}

function wpstart(){
	Cookies.set("sess","1") //Inizia la sessione
	sessionevalida=true
	Cookies.set("patenti",ver.pat,1) //Inizia la sessione
			
	var mevent=' onmouseover="alert(\''+this+'\')"'
	var panel = new Ext.Panel({
	    	region: 'center',
	    	frame: false,
	    	html: 
	    	'<div id="wpb-esame" class="wpbut" onclick="simulazioneesame()" title="Effettua una vera prova di esame"><img class="wplab" src="'+pregrafica+'grafica/puls/e.png" alt="" /><div class="wplab">Simulazione di Esame</div></div>'+
	    	'<div id="wpb-argo" class="wpbut" onclick="quizargomento(0)" title="Inizia l\'esercitazione su tutti i quiz suddivisi per argomento"><img class="wplab" src="'+pregrafica+'grafica/puls/a.png" alt="" /><div class="wplab">Esercizio per argomento</div></div>'+
	    	'<div id="wpb-sol" class="wpbut" onclick="mostrasoluzioni(0)" title="Visualizza le soluzioni di tutti i quiz"><img class="wplab" src="'+pregrafica+'grafica/puls/s.png" alt="" /><div class="wplab">Soluzioni dei quiz</div></div>'+
	    	'<div id="wpb-ris" class="wpbut" onclick="mostrarisultati(0)" title="Visualizza i risultati delle esercitazioni e delle simulazioni"><img class="wplab" src="'+pregrafica+'grafica/puls/r.png" alt="" /><div class="wplab">Risultati delle prove</div></div>'+
	    	((nomanu==true)?'':'<div id="wpb-man" class="wpbut" onclick="manualeteoria(0)" title="Visualizza il manuale di teoria per le patenti A e B"><img class="wplab" src="'+pregrafica+'grafica/puls/h.png" alt="" /><div class="wplab">Manuale di teoria</div></div>')
	  });
	
	win0 = new Ext.Window({
		title: ver.app+" - Start",
		width:310,
	    height:367,
	    border:false,
	    resizable:true,
		plain:true,
		layout: 'border',
		items: [panel],
	    	buttonAlign: 'right',
		buttons : [
		//{text: 'Opzioni',handler: function(){mostraopzioni(0);},tooltipType: 'title', tooltip: 'Modifica le impostazioni di WEBpatentino'},
		{text: 'Strumenti', 
			menu:[
				{text:'<span title="Modifica le impostazioni di WEBpatente">Opzioni...</span>',id:'0',handler:function(){mostraopzioni(0)},tooltipType: 'title', tooltip: 'Modifica le impostazioni di WEBpatente'},
				{text:'Esame', menu:[
					{text:'<span title="Salva la scheda di esame corrente">Esporta esame...</span>',id:'10',handler:function(){casc.esporta()}, tooltipType: 'title', tooltip: 'Salva la scheda di esame corrente'}
				]},
				{text:'Aiuto', menu:[
					{text:'<span title="Mostra la finestra con le informazioni essenziali">Introduzione a WEBpatente...</span>',id:'10',handler:function(){finaiuto()}, tooltipType: 'title', tooltip: 'Mostra la finestra con le informazioni essenziali'},
					{text:'<span title="Apri il modulo online per avere aiuto sui quiz">Chiedi aiuto agli esperti...</span>',id:'11',handler:function(){openbrowser(prot+'//www.rmastri.it/chiediagliesperti.html')}, tooltipType: 'title', tooltip: 'Apri il modulo online per avere aiuto sui quiz'},
					{text:'<span title="Mostra informazioni su questo programma e sul suo autore...">Informazioni su WEBpatente...</span>',id:'12',handler:function(){mostraopzioni(2)}, tooltipType: 'title', tooltip: 'Mostra informazioni su questo programma e sul suo autore...'}
					
				]}
			]
		},
		{text: 'Esci',handler: function(){confermachiusura();},tooltipType: 'title', tooltip: 'Termina l\'esecuzione di WEBpatente'} 
		],	
		close: function(){
			confermachiusura()
		}	
	});
	win0.show();

var panpv = new Ext.Panel({
			region: 'center',
			autoScroll: true,
			frame: false,
			contentEl: 'primavolta'
		});
	
	winpv = new Ext.Window({
		title: ver.app+" - Benvenuti",
		x:20,
		y:80,
		width:320,
			height:450,
			border:false,
			minimizable: false,
		collapsible: true,
		maximizable: true, 
			resizable:true,
		plain:true,
		close: function(){
			this.hide()
		},
		layout: 'border',
		items: [panpv],
			buttonAlign: 'right',
		buttons : [
		{text: 'Chiudi',handler: function(){winpv.close();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
		]
	});
	
	if (Cookies.get('start')==null){
		primavolta=true
		winpv.show(); 
		Cookies.set('start',(new Date()).toLocaleString())
	} 

	// Se c'un esame in sospeso riprendilo e ignora l'accesso diretto
	if (leggischedaprec()) {
		Ext.Msg.show({
   			title:"Esame in corso...",
   			msg: "L'ultima sessione è stata interrotta prima che l'utente ultimasse la prova d'esame.<br/>La prova interrotta sarà ora ripresa. Solo dopo la correzione della scheda si potrà accedere a tutte le funzioni di WEBpatente.",
   			buttons: Ext.Msg.OK, animEl: 'elId', icon: Ext.MessageBox.INFO,
   			fn: function(btn){
   				if(btn=='ok'){
   					simulazioneesame()			
				}					
   			}
		});		
				
	} else {
		//Accesso diretto
		var loc=accdir
		
		var interr=loc.indexOf("?")
		if (interr!=-1){
			var dummy=loc.indexOf("E",interr)
			if (dummy!=-1){
				var param=loc.substr(dummy+1)
				if (param=="")
					simulazioneesame()
				else{
					casc.importa(param)
					schedaimp=true
					simulazioneesame()
				}
				
			}else{
		
				querysol=false
				alunum=0
				interr=interr+1
		    	
				dummy=loc.indexOf("R",interr)
				if (dummy!=-1) querysol=true
		    	
				dummy=loc.indexOf("N",interr)
				if (dummy!=-1){
					alnum=parseInt(loc.substring(dummy+1))
					if (verifquiznum(alnum)==false) alnum=0;
					if (querysol)	
						mostrasoluzioni(alnum)
					else
						quizargomento(alnum)	
				}
				//DMW
				dummy=loc.indexOf("M",interr)
				if (dummy!=-1){
					alnum=parseInt(loc.substring(dummy+1))
					if (isNaN(alnum) || (alnum<0) || (alnum>titolilezioni.length-1)) alnum=0;						
					manualeteoria(alnum, true)
				}
				
				dummy=loc.indexOf("I",interr)
				if (dummy!=-1){
					winpv.show(); 
				}
				
				
			}
		}
	}
	
	// Controllo cookie
	if (offline==false){
		function acceptcookies(){
			document.cookie = 'cookie-accept=1; expires='+(new Date(2059,1,1)).toGMTString()+'; path=/'
		}
	
		if(document.cookie.indexOf('cookie-accept=1')==-1){
			Ext.Msg.show({title:"Informativa cookie",msg: "Questo sito utilizza <b>cookie</b> anche di terzi per mostrare pubblicità e servizi in linea con le tue preferenze. Se vuoi saperne di più o negare il consenso a tutti o ad alcuni cookie, <a href='"+prot+"//www.rmastri.it/page.php?62' target='_blank'>leggi qui</a>.<br>Utilizzando WEBpatente si accettano le nostre <a href='"+prot+"//www.rmastri.it/page.php?62' target='_blank'>politiche relative all'uso dei cookie</a>.",buttons: Ext.Msg.OK, animEl: 'elId', icon: Ext.MessageBox.INFO,onclose:function(){acceptcookies()}  });	
		}
	}
	
} // wpstart

function confermachiusura(){
	Ext.MessageBox.confirm('Richiesta di conferma', 'Si vuole uscire da '+ver.app+'?', function(btn){
   	if(btn=='yes'){
   		win0.hide()
   		document.location=prot+"//www.rmastri.it/webpatente/"
   	}});	
}

function f(v){
	if(v == maxquizesame){ //maxquizesame definito in wpte.js
		Ext.MessageBox.hide();
	}else{
		var i = v/(maxquizesame-1);
		Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% completato');
	}
}

function prog(valore,totale){
	if (valore==totale){
		Ext.MessageBox.hide();
	}else{
		var i= valore/totale
		Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% completato');
	}
}

function introduzione(){
document.write("<div class='introduzione'><b style='color: red;'>Introduzione a "+ver.app+" Mobile</b><br/><br/>"+
"<b>Benvenuto!</b> Stai per usare la versione mobile di WEBpatente, programma JavaScript per l'esercizio sui quiz dell'esame di teoria per "+ver.info.lepatenti+".<br/><br/>"+
// nota che questo non va bene per android
"<b>Che cosa devo fare?</b><br/>"+((offtype!="andro")?"Posiziona il tuo dispositivo mobile e regola lo zoom del browser in modo da vedere il testo di questa finestra in tutta la sua larghezza. In questo modo dovrai gestire soltanto lo &quot;scrolling&quot; verticale.<br/><br/>":"")+"Puoi cominciare trovando la <b>X rossa</b> in alto a destra (aspetta prima di toccarla!). &Egrave; il <b>pulsante di chiusura</b> delle schermate. Quando chiuderai questa schermata, al posto della X apparirà un <b>ingranaggio</b>, ovvero il pulsante per entrare nella schtermata delle <b>Opzioni</b>. Per tornare a questa introduzione dovrai aprire le Opzioni e scorrerle fino al pulsante &quot;Introduzione...&quot; e poi toccarlo.<br/><br/>"+

"<b>Il punto di partenza</b><br/>&Egrave; la schermata principale con i suoi <b>5 grossi pulsanti</b> che potrai vedere chiudendo questa finestra. Da essa puoi accedere alle principali funzioni del programma (quelle secondarie e quelle avanzate, invece, si attivano dalla schermata delle Opzioni).<br/><br/>"+

"<b>Simulazione d'esame</b><br/>Nella schermata principale tocca il pulsante contrassegnato dalla <a href='javascript:simulazioneesame()'><b>E rossa</b></a>. Dopo qualche secondo sarà mostrata la scheda di esame con i <b>"+maxquizesame+" quesiti</b>.<br/>Per rispondere usa il pulsante con il punto interrogativo. Tocca <b>una volta</b> per rispondere <b>vero</b> o <b>due volte</b> per rispondere <b>falso</b> (se ci ripensi, puoi cambiare la risposta continuando a toccare il pulsante che mostrerà alternativamente la V e la F). Se la figura che accompagna il quesito è troppo piccola, toccala per visualizzarne una copia ingrandita.<br/>Completa tutte e "+maxquizesame+" le risposte e tocca il pulsante &quot;Chiudi Esame&quot; (a inizio o a fine pagina) per ottenere il verdetto.<br/><br/>"+

"<b>Quiz per Argomento</b><br/>WEBpatente consente anche l'esercizio, per argomento, su <b>tutti i quiz ufficiali</b> previsti per l'esame di teoria. Tocca il pulsante con la <a href='javascript:quizargomento(0)'><b>A arancio</b></a> e scegli vero (1 click) o falso (2 click) per tutte le risposte proposte per ciascuno degli oltre seimila quesiti ordinati e raggruppati per contenuto.<br/><br/>"+

"<b>Esamina i tuoi progressi</b><br/>WEBpatente salva automaticamente i <b>risultati</b> delle prove e calcola le statistiche delle tue prestazioni. Potrai rivederli, anche a distanza di giorni, facendo click sul pulsante con la <a href='javascript:mostrarisultati(0)'><b>R verde</b></a>. Attenzione per&ograve;: i dati sono salvati come &quot;cookie&quot;. Se azzeri la memoria del browser, cancellando i &quot;dati personali&quot;, azzererai anche le statistiche.<br/><br/>"+

((nosugg==true)?"":"<b>Un sacco di aiuti</b><br/>WEBpatente mette a disposizione diversi tipi di aiuto. Dopo la correzione, toccando il testo di ogni quesito si possono visualizzare i pulsanti <a href='javascript:mostrasuggerimenti(1)'><b>Suggerimenti</b></a> e <a href='javascript:mostrasoluzioni(0)'><b>Soluzioni</b></a> che permettono di ottenere informazioni di aiuto sul quesito ed esaminare tutte le soluzioni dei quiz sul medesimo tema.<br/>Toccando il pulsante con la <a href='javascript:manualeteoria(0)'><b>H viola</b></a> nella finestra principale, puoi aprire un sintetico <b>Manuale di teoria</b> che contiene tutte le informazioni necessarie per superare l'esame. E, se non ti basta, puoi anche scrivere, gratuitamente, ai <a href='"+prot+"//www.rmastri.it/chiediagliesperti.html' target='_blank'><b>nostri esperti</b></a>.<br/><br/>")+

"<b>Impara facendo</b><br/>Scopri da solo le altre funzioni esplorando il programma. Non dimenticarti di verificare le opzioni disponibili toccando il pulsante con l'ingranaggio che appare in alto a destra nella schermata principale<br/><br/><div style='text-align: center'><b>Buon lavoro!</b></div><br/>Il Prof. Mastri</div>");
}

function informazioni(){
document.write("<b>"+ver.app+"</b> &egrave; un programma web per l'esercizio sui quiz ministeriali previsti per "+ver.info.lepatenti+".<br /><br />&Egrave; realizzato totalmente in JavaScript e disponibile in versione online (Standard o Mobile) e offline (per Windows, Mac OSX, Linux e Android).<br /><br />Autore di WEBpatente &egrave; il <a href='"+prot+"//www.rmastri.it/profmastri.html' target='_blank'><b>Prof. Roberto Mastri</b></a> del <a href='"+prot+"//www.liceomalpighi.it/' target='_blank'><b>Liceo Malpighi</b></a> di Bologna.<br /><br />Questo programma, anche se accessibile liberamente, <b>non è di pubblico dominio ed è protetto dalle norme vigenti sul diritto d'autore</b>. Sono vietati l'utilizzo, l'adattamento e l'inclusione del codice, dei testi e delle immagini che lo compongono in altre applicazioni o siti web e/o la loro diffusione con qualunque mezzo. &Egrave; inoltre vietato l'utilizzo del nome &quot;WEBpatente&quot; in altri siti e programmi.<br /><br />State usando la <b>versione "+ver.show()+"</b>.</br></br>Altre notizie e informazioni per eventuali contatti con l'autore possono essere trovate presso:<br><a href='"+prot+"//www.rmastri.it' target='_blank'><b>www.rmastri.it</b></a>, <a href='"+prot+"//www.liceomalpighi.it' target='_blank'><b>www.liceomalpighi.it</b></a><br/><br/>")
}

// ATTIVITA'

// Crea il menu lingue
function mb_setlin(l){
	lang=linguedisp[l]
	plang=lang+"/"
	if (op.valore("salvaoff")==false){
		Cookies.set("Lingua",lang)
	}
	linguacambiata=true
	linguacambiando=1
	ricaricaargo() //funzione in wpte.js
}
function menulingue(){
var mb_menulingue="<select onchange='mb_setlin(this.selectedIndex)'>"
for (x=0;x<linguedisp.length;x++){
	mb_menulingue+= "<option"+((lang==linguedisp[x])?" selected='selected'":"")+">"+lingue[linguedisp[x]].nome+"</option>"
}
mb_menulingue+="</select>"
return mb_menulingue
}

// Crea il menu patenti
function menupatenti(){
var mb_menupatenti="<select onchange='cambiapatente(this.value)'>"
for (x=0;x<patenti.length;x++){
	mb_menupatenti+= "<option"+((ver.pat==patenti[x])?" selected='selected'":"")+" value='"+patenti[x]+"'>"+pat[patenti[x]].nome+"</option>"
}
mb_menupatenti+="</select>"
return mb_menupatenti
}

function cambiapatente(nuovapat){
	Cookies.set("patenti",nuovapat,1)
	if (offline==true){
		var fname=document.location.href
		myext=fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2); //il fine non è necessariamente htm
		myperc=document.location.toString()
		var myperc=myperc.substr(0,myperc.lastIndexOf("/"))
		window.location.assign(myperc+"/mobi44-"+nuovapat+"."+myext)
	}else{
		//alert(pat[nuovapat].onlinen)
		window.location.assign(pat[nuovapat].online) // <-- DEBUG CAMBIARE .onlinen in .online
	}	
}

// Pulsante aggiorna (ANDRO)

function contraggio(){
	try{
		document.location=prot+'//www.rmastri.it/wpmobi_aggiornamenti.html&vers=44'+ver.sec+zerofit(ver.rev,3)+'&androver='+interjs.ritornavers()
	}catch (err){
		document.location=prot+'//www.rmastri.it/wpmobi_aggiornamenti.html&vers=44'+ver.sec+zerofit(ver.rev,3)
	}	
}