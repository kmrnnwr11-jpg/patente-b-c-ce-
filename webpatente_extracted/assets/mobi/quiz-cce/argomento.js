function indiceval(arr,ele){
	if (!Array.prototype.indexOf) {
		// funzione non impl in IE7 e 8
		for (var i in arr){
			if (arr[i]==ele) return i
		}
		return -1
	}else{
		return arr.indexOf(ele)
	}	
}

var cbox = {
	show: function (id,valore,handler){
		if (this.html==true){
			return "<input type='checkbox' id='"+id+"'"+((valore)?" checked='checked'":"")+" onclick='"+handler+"' />";
		}else{ //(Il valore è inserito in alt)	
			return "<a href='javascript:void(0)' class='opcka'><img class='opckimg' alt='"+valore+"' id='"+id+"' src='"+pregrafica+"grafica/"+percalt+"ck"+((valore)?"c":"u")+".png' onclick='this.alt=(this.alt==\"false\")?\"true\":\"false\";this.src=\""+pregrafica+"grafica/"+percalt+"\"+((this.src.lastIndexOf(\"cku\")!=-1)?((this.src.lastIndexOf(\"ckuo\")!=-1)?\"ckco.png\":\"ckc.png\"):((this.src.lastIndexOf(\"ckco\")!=-1)?\"ckuo.png\":\"cku.png\"));"+handler+"' onmouseover='this.src=\""+pregrafica+"grafica/"+percalt+"ck\"+((this.src.lastIndexOf(\"cku.png\")!=-1)?\"u\":\"c\")+\"o.png\"' onmouseout='this.src=\""+pregrafica+"grafica/"+percalt+"ck\"+((this.src.lastIndexOf(\"ckuo.png\")!=-1)?\"u\":\"c\")+\".png\"' /></a> "
		}
	},
	ischecked: function(ele){
		if (this.html==true){
			if (ele.checked) return true; else return false
		}else{
			if (ele.alt=="true") return true; else return false
		}	
	},
	uncheck: function(ele){
		if (this.html==true){
			ele.checked=false;
		}else{
			ele.alt="false";
			ele.src=pregrafica+"grafica/"+percalt+((ele.src.lastIndexOf("ckco.png")!=-1)?"ckuo.png":"cku.png");	
		}
	},
	check: function(ele){
		if (this.html==true){
			ele.checked=true;
		}else{
			ele.alt="true";
			ele.src=pregrafica+"grafica/"+percalt+((ele.src.lastIndexOf("ckuo.png")!=-1)?"ckco.png":"ckc.png");	
		}
	},	
	doclick: function(ele){
		if (this.html==true){
			ele.click()
		}else{
			ele.onclick()
		}		
	},
	
	html: false
}

var arg={
	m: maxquizesame,
	nocap:false,
	a:[
//iarg

{c:1,t:"Disposizioni che regolano i periodi di guida e di riposo",g:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],n:[10,8,5,2,7,4,9,6,8,4,5,1,2,1,1,6,10],l:89},
{c:2,t:"Impiego del cronotachigrafo",g:[18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58],n:[10,13,1,1,2,2,2,1,1,10,10,8,8,1,1,9,8,1,2,1,2,2,3,1,2,2,2,2,8,7,6,15,5,2,10,8,3,10,9,13,3],l:207},
{c:3,t:"Disposizioni che regolano il trasporto di cose e persone",g:[59,61,63,65,67,69,70,71,72,73,74,75,76,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,100,101,102,103,104,105,106,107,108],n:[19,3,5,7,6,2,3,2,2,21,11,6,4,6,7,6,5,5,6,8,8,7,6,8,6,8,6,4,2,1,1,16,4,14,2,19,7,7,4,21],l:285},
{c:4,t:"Documenti di circolazione e di trasporto necessari per il trasporto di cose e di persone sia a livello nazionale che internazionale",g:[109,110,111,112,113,114,115],n:[11,3,3,5,9,5,12],l:48},
{c:5,t:"Comportamento in caso di incidente; ingombro della carreggiata; uso del segnale triangolare mobile di pericolo",g:[122,123,124,125,126,127,128,129,130,131,132,133,134,135],n:[10,6,6,4,5,14,4,7,8,14,8,10,26,14],l:136},
{c:6,t:"Precauzioni da adottare in caso di rimozione e sostituzione delle ruote",g:[136,137],n:[16,15],l:31},
{c:7,t:"Disposizioni che regolano dimensione e massa dei veicoli; disposizioni che regolano i dispositivi di limitazione della velocità;",g:[140,141,143,144,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166],n:[2,10,2,7,3,1,6,16,13,6,9,10,4,14,10,9,13,6,12,23,14,18,15,7,8],l:238},
{c:8,t:"Limitazione del campo visivo legata alle caratteristiche del veicolo",g:[167,168,169,170,171],n:[10,9,10,10,15],l:54},
{c:9,t:"Fattori di sicurezza relativi al caricamento dei veicoli e alle persone trasportate",g:[173,174,175,176,177,178,179,192,193,194],n:[10,20,6,6,3,1,15,11,11,2],l:85},
{c:10,t:"Sistemi di aggancio alla motrice di rimorchi e semirimorchi e relativi sistemi di frenatura",g:[195,196,197,198,199,200,201,202,203,204],n:[18,17,19,12,10,2,9,8,14,11],l:120},
{c:11,t:"Nozioni sulla costruzione ed il funzionamento dei motori a combustione interna, dei liquidi e del sistemi di alimentazione del carburante, e",g:[205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264],n:[13,14,10,12,15,6,6,19,10,7,10,4,8,10,8,10,10,12,10,19,21,10,16,6,14,6,9,10,10,6,10,13,14,9,4,8,17,17,2,14,10,6,9,6,11,2,4,21,14,19,14,19,17,18,15,13,18,17,11,12],l:685},
{c:12,t:"Lubrificazione e protezione dal gelo",g:[265,266,267,268,269,270,271,272,273,274,275,276,277],n:[8,27,3,25,6,16,6,12,17,2,15,6,16],l:159},
{c:13,t:"Nozioni su costruzione, montaggio e corretto impiego e manutenzione degli pneumatici",g:[278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306],n:[14,12,14,1,8,10,22,15,10,8,8,14,12,4,12,2,1,14,9,14,7,12,9,14,17,12,16,6,12],l:309},
{c:14,t:"Freno e acceleratore: nozioni sui tipi esistenti, funzionamento, componenti principali, collegamenti, impiego e manutenzione ordinaria, comp",g:[307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332],n:[10,11,9,12,9,13,7,7,14,10,12,11,14,4,1,4,2,6,10,6,10,9,10,1,10,8],l:220},
{c:15,t:"Metodi per individuare le cause dei guasti. Organi di direzione. Sospensioni e ammortizzatori",g:[333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366],n:[7,8,4,9,10,7,6,6,4,8,4,4,4,4,4,4,5,6,12,4,11,2,4,8,14,15,2,4,6,13,12,7,5,15],l:238},
{c:16,t:"Manutenzione dei veicoli a scopo preventivo e effettuazione delle opportune riparazioni ordinarie",g:[367,368,369,370,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392],n:[11,8,20,13,5,6,12,6,16,8,6,11,11,9,12,6,11,4,4,2,4,6,7,6,13],l:217},
{c:17,t:"Responsabilità del conducente in merito a ricevimento, trasporto e consegna delle merci nel rispetto delle condizioni concordate",g:[393,394,395,396,397],n:[16,20,14,20,6],l:76}

//farg
	],
	ct:[],
	rq: function(x,n){
		var t=0
		for (var i in this.a[x].n){
			t+=this.a[x].n[i]
			if (t>=n){
				r=this.a[x].n[i]-(t-n)-1 //-1 perché in base 0
				var dumq= this.a[x].g[i] //##
				if (nascosta(dumq,r)) r=this.a[x].n[i]; //## Se la risp è nascosta prendi quella dopo l'ultima (per nascondere una risp non basta la definizione in dati.js: occorre togliere -1 a a[].n e a a[].l sopra)
				return {d: dumq,r: r} //##
				break
			}
		}	
	},	
	
	s: [], //argomenti selezionati

	sat: function(x){ // aggiungi togli elemento
		if (x<this.a.length){
			//var i=this.s.indexOf(x)
			var i=indiceval(this.s,x)
			if (i==-1){ // Non c'è: aggiungilo
				this.s.push(x)
			}else{ // C'è: toglilo
				if (i!=-1) this.s.splice(i,1);
			}
			this.sv()
		}else{
			alert("Argomento inesistente ("+x+")")
		}
		//this.sv() //memorizza ogni cambiamento	
	},
	sec: function(c,ele){ // seleziona/deseleziona capitolo
		var v=cbox.ischecked(ele)
		for (var i=0;i<this.a.length;i++){
			if (this.a[i].p==c) {
				var dum=getWin(winargoesa,'op'+i)		
				if (v!=cbox.ischecked(dum))
				cbox.doclick(dum)
			}
		}
	},
	dec: function(c,valore){
		if (valore==false){
			var dum=getWin(winargoesa,'cap'+c)
			if(cbox.ischecked(dum)){
				cbox.uncheck(dum)
			}
		}else{
			for (var i=0;i<this.a.length;i++){ // se sono tutti selezionati
				if (this.a[i].p==c) {
					var dum=getWin(winargoesa,'op'+i)
					var v=cbox.ischecked(dum)
					if (v==false) return
				}	
			} // seleziona anche il capitolo
			var dum=getWin(winargoesa,'cap'+c)
			if(cbox.ischecked(dum)==false){
				cbox.check(dum);
			}
		}		
	},

	la: function(x){ //numero quesiti dell'argomento x (base 0)
		return this.a[x].l
	},
	dom: [],
	ris: [],
	soi:function(x){ //inizializza il vettore di sorteggio
		var a=[]
		for (var i=0;i<this.la(x);i++){
			a[i]=i+1 //base 1
		}
		return a
	},
	ve: function(){ //verifica che ci siano abbastanza quiz
		var t=0
		for (var i=0;i<this.s.length;i++){
			t+=this.la(this.s[i])
		}
		if (t<this.m){ //Non ce ne snon abbastanza
			return {s:false,t:false,m:"Non ci sono abbastanza quesiti. Selezionare altri argomenti"}
		}else{
			if (this.s.length>this.m){
				var dif=this.s.length-this.m;
				return {s:false,t:this.s.length,m:"Attenzione si sono selezionati "+this.s.length+" argomenti. Se si continua, "+dif+" di questi, "+((dif==1)? "scelto a caso, non sarà incluso":"scelti a caso, non saranno inclusi")+" nella prova di esame, che comprende solo "+this.m+" quesiti. \nPremere OK per continuare. \nIn alternativa si può fare click su Annulla e deselezionare "+((dif==1)?"l'argomento eccedente.":"gli argomenti eccedenti.")}
			}else{
				return {s:true}
			}
		}	
				
	},
	so: function(){ //sorteggia 		
		// Cancella i quiz vecchi
		this.dom=[];
		this.ris=[];
		var vs=[]
		
		var tmp=this.s.slice(0)
		if (tmp.length>this.m){ //Sorteggia gli it argomenti in esubero da eliminare
			it=tmp.length-this.m
			for (j=0;j<it;j++){
				var so=rnd(0,(tmp.length-1))
				tmp.splice(so,1);	
			}
		}

		for (j=0;j<this.m;j++){ // Ripeti il sorteggio fino a maxquiz volte
			for (var i=0;i<tmp.length;i++){ // Per ciascun argomento	
				if (j==0) { // Popola il vettore di sorteggio del capitolo
					var a=this.soi(tmp[i])
					vs[i]=a						
				}
				if (vs[i].length>0){ //Se l'argomento non è esaurito
					//document.write(vs[i].length+"|")				
					var so=rnd(0,(vs[i].length-1))
					var q=this.rq(tmp[i],vs[i][so])
					this.dom.push(q.d)
					this.ris.push(q.r)
					vs[i].splice(so,1);	
					if (this.dom.length>=this.m) break;
				}
			}			
			if (this.dom.length>=this.m) break;
		}
		this.dor()
		return {s:true}
			
	},
	dor: function(){	//disordina dom e ris
		var vd=[]
		for (var i in this.dom){
			vd[i]=i
		}
		var tmpdom=[];
		var tmpris=[];
		var t=""
		for (var i in this.dom){
			var di=rnd(0,(vd.length-1));			
			//t+=" "+vd[di]
			tmpdom[i]=this.dom[vd[di]];
			tmpris[i]=this.ris[vd[di]];
			vd.splice(di,1);
		}
		this.dom=tmpdom
		this.ris=tmpris
	},
	ta: function(c,i){
		var a=0
		for (var j=i;j<this.a.length;j++){
			if (this.a[j].c==c){ 
				a++
				this.a[j].p=i
			}else
				break
		}
		return (a==1);
	},
	tus: function(c){// Controlla se tutti gli argomenti di un capitolo sono selezionati
		var j=0
		for (i in this.a){ 
			if (this.a[i].p==c) {
				if (indiceval(this.s,j)==-1) return false
			}
			j++
		}
		return true
	},
		
	mo: function(){ //mostra
		this.ld() // Carica i cookie
		
		var ret="";
		var ua=-1
		var c=0	
	
		for (var i=0;i<this.a.length;i++){	
			// Argomenti che non sono titolo
			var valore=(indiceval(this.s,c)==-1)?false:true
			if (this.nocap==true){
				ret+="<table class='cap'><tr><td class='arg' style='padding-right:6px;'><span class='anu'>"+zerofit((c+1),2)+")</span></td><td class='arg aop'>"+cbox.show('op'+i,valore,'arg.sat('+i+')')+"</td><td class='arg'>"+this.a[i].t+" <span title='"+this.a[i].l+" quesiti disponibili'>["+this.a[i].l+"]</span></td></tr></table>";
			}else{	
				var tmp="<table class='arg'><tr><td class='arg aop'>"+cbox.show('op'+i,valore,'arg.dec(arg.a['+i+'].p,cbox.ischecked(this));arg.sat('+i+')')+"</td><td class='arg'><span class='ade'>"+this.a[i].t+" <span title='"+this.a[i].l+" quesiti disponibili'>["+this.a[i].l+"]</span></span></td></tr></table>";
				if (ua!=this.a[i].c){
					ua=this.a[i].c
					//if (argomenti[ua-1]!=this.a[i].t){ // Titoli che non sono argomenti
					if (this.ta(ua,i)==false){
						valore=(this.tus(i))?true:false
						ret+="<table class='cap'><tr><td class='cap aop'>"+cbox.show('cap'+i,valore,'arg.sec('+i+',this)')+"</td><td class='cap'> <span class='cde'><b>"+zerofit(ua,2)+") "+((this.ct[ua-1]==null)?argomenti[ua-1]:this.ct[ua-1])+"</b></span></td></tr></table>"
						ret+=tmp
					}else{ // Titoli che sono argomenti
						ret+="<table class='cap'><tr><td class='cap aop'>"+cbox.show('op'+i,valore,'arg.sat('+i+')')+"</td><td class='cap'> <span class='cde'><b>"+zerofit(ua,2)+") "+this.a[i].t+"</b> <span title='"+this.a[i].l+" quesiti disponibili'>["+this.a[i].l+"]</span></span></td></tr></table>";
					}
				}else{
					ret+=tmp	
				}
			}
			c++;
		}
		return ret;
	}, 
	res: function(){ //reset
		while (this.s.length>0){
			var dum=getWin(winargoesa,'op'+this.s[0])
			cbox.doclick(dum)
		}
		// alert(this.s)
		
	},
	cs: function (){
		var dum=this.so()
		if (dum.s==true){
			dom=""
			rip=""
			for (var n in this.dom){
				dom+=zerofit(this.dom[n],3)
				rip+=zerofit(this.ris[n],2)
			}
			var d=schedasplit(dom,12) //12 e 10 non sono relativi al numero di quesiti //Wpno: var d=schedasplit(dom,domsplit)
			var r=schedasplit(rip,10) //ma alla dimensine delle stringhe di dati
        	
			esameincorso=true
			Cookies.set("dom", d) // Imposta questo come nuovo esame precedente
			Cookies.set("rip", r)
			casc.essec="01"
			casc.esmin="30" //wpno: ""+maxminuti 
			casc.solut="0-0"
			casc.quizatt=0
			casc.correz=false
			schedaprec=true
		}	
		return {s:dum.s,m:dum.m,d:d,r:r} // s=esito del sorteggio
	},
	sv: function (){
		var dum=""
		for (var i=0;i<this.s.length;i++){
			dum+=zerofit(this.s[i].toString(16),2)
		}
		Cookies.set("arge",dum)
	
	},
	ld: function (){
		var savd=Cookies.get("arge")
		if(savd!=null){
			c=0
			for (var i=0;i<savd.length;i+=2){
				this.s[c]=parseInt(savd.substr(i,2),16)
				c++
			}	
		}
	}
}
if (ver.mobi==true){
	mostraesargo()
}