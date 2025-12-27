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
//
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
{c:1,t:"Segnali di pericolo",g:[62,64,66,68,74,78,80,81,82,89,90,91,93,95,96,97,104,107,108,110,113,114,118,119,123,125],n:[6,6,6,6,6,6,4,6,6,6,6,6,6,6,4,6,6,4,6,6,6,6,6,6,6,4],l:148},
{c:2,t:"Segnali di divieto",g:[130,132,133,137,140,141,142,143,144,145,149,150,159,160,161,164,165,166,168,169,178,179,180],n:[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],l:138},
{c:2,t:"Segnali di obbligo",g:[184,185,187,188,189,192,194,196,199,200,202,204,205,208,210,211,212,213,214,216,222,223,224],n:[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],l:138},
{c:3,t:"Segnali di precedenza",g:[225,226,228,229,231,232,233,236,237,238,239,240,241,242,245],n:[6,6,6,4,6,6,6,6,6,6,6,6,6,6,6],l:88},
{c:4,t:"Segnaletica orizzontale",g:[247,248,249,250,253,254,255,256,257,258,263,264,265,267,268,269,270,271,272,274,275,276,277,282,283,284,285,286,290,292],n:[3,2,6,4,1,6,6,1,1,6,5,2,1,1,1,1,6,3,1,6,6,6,6,6,6,5,1,4,4,2],l:109},
{c:4,t:"Segnalazioni semaforiche (semafori)",g:[295,296,297,300,301,302,303,304,306,308,312],n:[6,6,6,4,4,6,6,6,7,6,6],l:63},
{c:4,t:"Segnalazioni degli agenti del traffico (vigile)",g:[315,316,317,318],n:[6,6,6,6],l:24},
{c:4,t:"Documenti da esibire agli agenti",g:[321],n:[6],l:6},
{c:4,t:"Regolazione della velocità",g:[481,482,483,484,485,486,487,488,489,490,492],n:[6,3,6,15,5,3,11,10,12,1,2],l:74},
{c:4,t:"Limiti di velocità",g:[495,497,498,499,501,502,503,504],n:[6,6,8,14,10,5,4,5],l:58},
{c:4,t:"Distanza di sicurezza",g:[506,508,509,510,511,512,513,514,515,516,517,518,519,520,522],n:[1,6,8,8,6,3,4,4,4,3,9,11,2,8,5],l:82},
{c:5,t:"Posizione dei veicoli sulla carreggiata",g:[523,524,525,526,528,529,530,531,533,534,536,537,539,540,541,543],n:[1,5,1,1,1,2,2,1,1,1,1,1,1,1,5,1],l:26},
{c:5,t:"Cambio di direzione o di corsia (svolta, inversione di marcia)",g:[546,547,548,549,550,553,554,555,556,557,558,559,562,563,564,565],n:[8,7,1,2,6,3,4,1,1,1,1,1,1,1,9,8],l:55},
{c:5,t:"Immissione nella circolazione e arresto sul margine",g:[567],n:[7],l:7},
{c:5,t:"Comportamento agli incroci e norme sulla precedenza",g:[573,574,575,576,578,579,580,581,583,584,585,586,589],n:[6,9,2,11,3,1,4,9,3,3,1,7,1],l:60},
{c:5,t:"Comportamenti per un corretto uso della strada",g:[590,591,596,598],n:[6,8,4,6],l:24},
{c:6,t:"Uso delle luci",g:[762,763,764,765,766,767,769,770,771,772,773],n:[6,7,1,2,3,2,8,6,5,10,6],l:56},
{c:6,t:"Cinture di sicurezza - Airbag - Seggiolini - Poggiatesta",g:[787,788,789,790,791,792,793],n:[17,4,4,8,2,12,4],l:51},
{c:6,t:"Casco protettivo",g:[794,795,796],n:[4,14,17],l:35},
{c:7,t:"Sorpasso",g:[656,657,658,659,660,661,662,663,665,666,667,669,670,671,672,674,675,676,677,679,680,681],n:[9,6,2,1,1,4,3,1,1,4,3,3,2,7,4,4,16,1,1,1,5,1],l:80},
{c:7,t:"Cause di incidenti stradali - Comportamento per prevenire incidenti e in caso di incidente",g:[821,822,823,824,827,828,829,830,831,834,835,836],n:[5,6,6,8,8,3,2,1,5,5,1,10],l:60},
{c:8,t:"Fermata, sosta, arresto e partenza",g:[684,685,688,695,698,699,700,701],n:[9,6,6,3,12,10,7,1],l:54},
{c:8,t:"Norme di circolazione sulle autostrade e strade extraurbane principali",g:[711,712,714,716,717,718],n:[5,6,2,9,2,5],l:29},
{c:8,t:"Traino dei rimorchi",g:[750,751,753],n:[10,8,4],l:22},
{c:8,t:"Limitazione dei consumi. Rispetto dell’ambiente; inquinamento: atmosferico, acustico, da cattivo smaltimento dei rifiuti",g:[874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889],n:[13,4,7,7,7,8,8,8,1,2,8,3,2,9,8,8],l:103},
{c:9,t:"Guida in relazione alle qualità e condizioni fisiche e psichiche - Alcool, droga e farmaci - Obbligo di lenti",g:[837,838,839,840,841,842,844],n:[2,8,4,5,5,10,8],l:42},
{c:9,t:"Primo soccorso",g:[845,846],n:[8,6],l:14},
{c:10,t:"Elementi costitutivi del veicolo importanti per la sicurezza (pneumatici, freni, sospensioni, ammortizzatori, sterzo)",g:[890,891,892,893,894,895,897,899,900,901,902,903,904,905,906,907,908],n:[6,9,11,3,3,7,6,8,1,2,14,8,14,8,1,11,11],l:123},
{c:10,t:"Controllo nei motocicli (interruttore di emergenza, catena di trasmissione)",g:[910,911],n:[9,13],l:22},
{c:10,t:"Stabilità e tenuta di strada del veicolo",g:[915,916,917,919,920,921,922],n:[5,5,4,5,5,6,7],l:37}
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
//Anche in mobi (abrev) il file è caricato subito
//if (ver.mobi==true){
//	mostraesargo()
//}
//cust
function trovainarr(arr,tro){ret=-1;for (var x=0;x<arr.length;x++){if (arr[x]==tro){ret=x;break;}}return ret;}function cercaargo(e){var ret=-1;for(var i=0;i<arg.a.length;i++){var t=trovainarr(arg.a[i].g,e);if(t!=-1){argoidx=t;ret=i;break;}}return ret;}function trovaquizatt(scheda,ofs){var s=scheda.substr(6,3);var qan=eval("parseInt("+scheda+".quesiti[0].numero)");var qac=eval("getWin("+scheda+".outwin,'selargo_"+s+"').selectedIndex");if(ofs>0){if(argoidx+ofs>arg.a[qac].g.length-1){if(qac+1==arg.a.length){qac=0}else{qac++}ret=arg.a[qac].g[0]-1}else{ret=arg.a[qac].g[argoidx+ofs]-1}}else{if(argoidx+ofs<0){if(qac==0){qac=arg.a.length-1}else{qac--}ret=arg.a[qac].g[arg.a[qac].g.length-1]+1}else{ret=arg.a[qac].g[argoidx+ofs]+1}}return ret};function vaiquiz(ofs,scheda,func,quizatt){ofs=parseInt(ofs);if(quizatt==null)quizatt=trovaquizatt(scheda,ofs);eval(func+"(quizatt+ofs)")}var selargo=" class='selargosel'>";for(i=0;i<arg.a.length;i++){selargo+="<option value='"+arg.a[i].g[0]+"'>"+(parseInt(i)+1)+". "+arg.a[i].t+" (Cap. "+arg.a[i].c+")"+"</option>"}selargo+="</select>";var argoidx;
function prosquiz(q,o){return q+o}
