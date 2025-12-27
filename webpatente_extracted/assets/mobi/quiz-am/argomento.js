/* Per Wpno 4.0 */

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
cc=function(c){return String.fromCharCode(c)}
var arg={
	m: maxquizesame,
	nocap:false,
	a:[
//iarg
{c:1,t:'Segnali di pericolo',g:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42],n:[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],s:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,28,21,24,22,23,25,26,27,29],l:252},
{c:2,t:'Segnali di precedenza',g:[43,44,45,46,47,48,49,50,51,52,53,54],n:[6,6,6,6,6,6,6,6,6,6,6,6],s:[84,78,80,75,82,81,76,74,77,79,83],l:72},
{c:2,t:'Segnali di divieto',g:[55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74],n:[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],s:[30,31,32,41,33,40,34,35,37,36,38,39,42,43,47,44,45,46,48],l:120},
{c:2,t:'Segnali di obbligo',g:[75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98],n:[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],s:[53,54,55,56,49,57,58,59,60,61,62,50,51,64,65,66,67,68,69,71,70,72,73,52],l:144},
{c:3,t:'Segnali di indicazione',g:[99,100,101,102,103,104,105,106],n:[6,6,6,6,6,6,5,6],s:[100,99,102,103,104,106,105,107],l:47},
{c:3,t:'Segnali complementari e di cantiere',g:[107,108,109,110],n:[6,6,6,6],s:[97,98,96,101],l:24},
{c:3,t:'Pannelli integrativi dei segnali',g:[111,112,113,114,115,116,117,118,119,120,121],n:[6,6,6,6,6,6,6,6,6,6,6],s:[85,86,87,88,89,90,91,92,93,94,95],l:66},
{c:3,t:'Segnali luminosi (semafori)',g:[122,123,124,125,126,127],n:[6,6,6,6,6,6],s:[108,109,110],l:36},
{c:3,t:'Segnaletica orizzontale',g:[128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144],n:[7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,6],s:[111,122,119,112,120,123,124,113,118,117,114,121,125,116,115],l:104},
{c:4,t:'Ordine di precedenza (incroci)',g:[145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160],n:[8,7,8,7,7,8,9,6,7,8,9,8,8,8,6,6],s:[137,132,133,129,131,138,128,139,127,135,126,141,136,134,130,140],l:120},
{c:5,t:'Cambio di corsia, cambio di direzione (svolte)',g:[161,162,163,164,165,166,167,168],n:[6,6,6,6,6,6,6,6],s:[153,152,154],l:48},
{c:5,t:'Velocit'+cc(224)+'',g:[169,170,171,172,173,174,175,176],n:[7,6,6,6,6,6,6,6],s:[142,144,143],l:49},
{c:5,t:'Distanza di sicurezza',g:[177,178,179],n:[6,6,6],s:[145],l:18},
{c:5,t:'Sorpasso',g:[180,181,182,183,184,185,186,187,188,189,190],n:[6,6,7,6,6,6,6,6,5,6,8],s:[147,146,149,150,148,151],l:68},
{c:6,t:'Definizioni stradali',g:[191,192,193,194,195],n:[6,6,7,6,6],s:[159,162,163,161,160],l:31},
{c:6,t:'Fermata, sosta e partenza',g:[196,197,198,199,200,201,202,203,204,205,206,207],n:[6,6,6,6,6,6,6,6,6,6,6,6],s:[155,156,157,158],l:72},
{c:7,t:'Cause di incidenti stradali',g:[208,209,210,211,212,213,214,215],n:[6,6,6,6,7,6,6,6],s:[165,207,178],l:49},
{c:7,t:'Eventi atmosferici (pioggia, neve, nebbia, vento)',g:[216,217,218,219,220,221,222,223,224,225,226],n:[6,6,5,6,6,6,7,6,6,8,6],s:[165,167,169,168,171,170,172,173],l:68},
{c:7,t:'Uso corretto della strada',g:[227,228,229,230,231,232,233,234,235,236,237],n:[6,6,6,6,6,6,6,6,6,6,6],s:[207,177,166,176,175,174,181,179,180],l:66},
{c:7,t:'Assicurazione',g:[238,239,240],n:[8,6,6],s:[182,183,184],l:20},
{c:8,t:'Casco protettivo',g:[241,242,243,244,245,246],n:[7,6,6,6,7,6],s:[201,200],l:38},
{c:8,t:'Dispositivi di equipaggiamento (luci, specchietti, clacson)',g:[247,248,249,250,251,252,253,254,255],n:[7,7,6,6,6,6,5,7,8],s:[185,188,187,186,197,192,189],l:58},
{c:8,t:'Elementi costitutivi del veicolo (pneumatici, freni)',g:[256,257,258,259,260,261,262,263,264,265,266,267],n:[6,6,6,6,6,6,6,7,6,8,6,4],s:[190,191,194,195,196,192,198,207,193],l:74},
{c:9,t:'Documenti per la guida',g:[268,269,270,271],n:[6,6,5,6],s:[203,204],l:23},
{c:9,t:'Comportamenti alla guida di un ciclomotore',g:[272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297],n:[6,6,7,8,8,6,7,6,6,6,6,6,6,7,6,6,8,6,6,6,6,6,6,6,6,6],s:[205,207,178,209,210,208,246,219,211,167,214,218,215,217,216,206,156,212],l:170},
{c:10,t:'Stato fisico del conducente',g:[299,300,301,302,303,304,305,306],n:[7,6,6,6,10,6,6,7],s:[241,242,231,229,230],l:54},
{c:10,t:'Doveri del conducente',g:[307,308,309,310,311,312,313,314,315,317,318],n:[6,8,5,6,6,6,5,6,6,8,5],s:[232,207,238,237,236,239,220,244,245,240,197],l:73},
{c:10,t:'Comportamenti in caso di incidente',g:[319,320,321,322,323,324,325,326],n:[6,6,4,6,5,6,6,6],s:[225,224,223,226,227,228],l:45},
{c:10,t:'Responsabilit'+cc(224)+' civile e penale',g:[327,328],n:[8,9],s:[221,222],l:17},
{c:10,t:'Inquinamento',g:[329,330,331,332,333,334],n:[6,6,6,6,6,6],s:[233,234,235,243],l:36}
//farg
	],
	c:['Segnali di pericolo','Segnali di precedenza. Segnali di divieto. Segnali di obbligo.','Segnali di indicazione. Segnali complementari e di cantiere. Pannelli integrativi dei segnali. Segnali luminosi (semafori). Segnaletica orizzontale','Norme sulla precedenza (ordine di precedenza agli incroci)','Svolta (destra e sinistra), cambio di corsia, cambio di direzione. Velocità. Distanza di sicurezza. Sorpasso.','Definizioni stradali. Fermata, sosta e partenza','Cause di incidenti stradali, eventi atmosferiche (pioggia, neve, nebbia, vento). Assicurazione','Casco protettivo. Elementi del ciclomotore e loro uso (luci, specchietti, clacson, pneumatici, freni)','Comportamenti alla guida del ciclomotore','Educazione alla legalità'],
	
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
						ret+="<table class='cap'><tr><td class='cap aop'>"+cbox.show('cap'+i,valore,'arg.sec('+i+',this)')+"</td><td class='cap'> <span class='cde'><b>"+zerofit(ua,2)+") "+((this.ct[ua-1]==null)?arg.c[ua-1]:this.ct[ua-1])+"</b></span></td></tr></table>"
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
			var d=schedasplit(dom,domsplit) //12 e 10 non sono relativi al numero di quesiti
			var r=schedasplit(rip,10) //ma alla dimensine delle stringhe di dati
        	
			esameincorso=true
			Cookies.set("dom", d) // Imposta questo come nuovo esame precedente
			Cookies.set("rip", r)

			casc.essec="01"
			casc.esmin=""+maxminuti
			casc.solut="0-0"
			casc.correz=false
			
			casc.quizatt=0
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