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
{c:1,t:"Definizioni stradali e di traffico",g:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],n:[10,11,7,20,7,6,7,8,9,7,14,16,21,10,7,11,9,11,12],l:203},
{c:1,t:"Uso di corsie e carreggiate (1)",g:[20,21,22],n:[7,8,11],l:26},
{c:1,t:"Definizione e classificazione dei veicoli",g:[23,24,25,26,27,28,29,30,31,32],n:[11,11,8,14,11,14,9,6,8,15],l:107},
{c:1,t:"Pannelli sui veicoli (1)",g:[33,34,35,36,37,38],n:[1,1,3,2,7,3],l:17},
{c:1,t:"Doveri del conducente nell’uso della strada - Convivenza civile e uso responsabile della strada)",g:[39,40,41,42,43,44,45,46,47,48,49],n:[6,12,8,9,9,8,3,15,8,3,1],l:82},
{c:1,t:"Riguardo verso gli utenti deboli della strada (diversamente abili, anziani, bambini, pedoni, ciclisti)",g:[50,51,52,53,54,55,56,57,58],n:[11,12,11,12,9,9,14,13,7],l:98},
{c:2,t:"Segnali di pericolo",g:[59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129],n:[17,1,1,10,13,11,12,9,14,12,15,11,13,1,1,12,12,12,18,9,14,10,13,12,1,1,10,1,1,14,14,11,13,12,6,13,9,8,14,1,1,15,12,12,13,11,1,1,11,15,14,7,10,12,14,6,14,3,10,11,14,14,10,12,14,12,6,1,2,1,1],l:662},
{c:3,t:"Segnali di divieto",g:[130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182],n:[17,11,16,10,1,12,12,14,16,10,12,13,12,12,11,10,11,12,13,13,12,12,9,10,10,14,7,8,9,12,11,13,10,10,10,7,12,2,14,11,10,1,1,1,1,1,3,8,10,11,11,15,7],l:521},
{c:4,t:"Segnali di obbligo",g:[183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224],n:[6,15,17,7,12,14,16,9,19,10,12,15,8,13,9,12,9,11,9,9,10,11,9,9,1,12,13,11,11,9,7,10,9,10,8,9,7,10,7,8,10,10],l:433},
{c:5,t:"Segnali di precedenza",g:[225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246],n:[16,9,13,9,9,14,11,12,11,1,13,9,15,12,12,12,12,13,12,8,11,9],l:243},
{c:6,t:"Segnaletica orizzontale",g:[247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293],n:[3,2,10,6,1,7,1,9,10,2,1,10,1,3,9,9,9,2,2,3,2,1,2,10,5,1,1,9,10,13,8,6,7,6,6,6,9,8,1,11,8,7,11,4,2,6,1],l:261},
{c:7,t:"Segnalazioni semaforiche (semafori)",g:[294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314],n:[9,10,12,11,3,8,14,6,10,9,11,8,9,15,8,7,8,5,10,14,8],l:195},
{c:7,t:"Segnalazioni degli agenti del traffico (vigile)",g:[315,316,317,318],n:[11,8,8,10],l:37},
{c:7,t:"Riconoscimento degli agenti - Fischietto - Documenti da esibire",g:[319,320,321],n:[5,8,8],l:21},
{c:8,t:"Segnali di indicazione",g:[322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384],n:[9,10,11,14,10,10,11,11,11,10,11,11,9,10,10,11,11,10,8,12,12,9,9,8,10,10,8,10,10,11,8,8,7,7,9,9,9,10,8,7,7,9,10,11,10,11,7,10,10,10,9,8,10,9,11,7,8,10,11,7,10,10,9],l:603},
{c:9,t:"Segnali temporanei di cantiere",g:[385,386,387,388,389,390,391,392,393,394],n:[10,8,10,10,9,11,7,9,10,9],l:93},
{c:9,t:"Segnali complementari",g:[395,396,397,398,399,400,401,402,403],n:[10,9,10,10,10,11,9,10,9],l:88},
{c:10,t:"Pannelli integrativi dei segnali",g:[404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474],n:[9,8,1,1,3,1,1,1,1,1,6,1,1,1,1,1,1,1,8,1,1,1,1,6,2,1,2,4,4,1,6,1,1,1,1,1,6,1,1,1,1,1,1,5,1,1,1,1,1,1,1,7,9,10,7,2,12,11,9,1,11,12,10,2,11,1,8,3,12,8,10],l:263},
{c:11,t:"Pericoli nella circolazione",g:[475,476,477,478,479,480],n:[8,12,3,11,8,6],l:48},
{c:11,t:"Regolazione della velocità",g:[481,482,483,484,485,486,487,488,489,490,491,492,493,494],n:[7,4,7,20,6,4,16,12,12,2,5,2,3,2],l:102},
{c:11,t:"Limiti di velocità",g:[495,496,497,498,499,500,501,502,503,504,505],n:[10,1,9,13,18,12,20,9,4,5,6],l:107},
{c:12,t:"Distanza di sicurezza",g:[506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522],n:[1,8,6,10,9,7,5,9,7,8,5,16,13,5,10,10,6],l:135},
{c:13,t:"Uso di corsie e carreggiate (2)",g:[523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545],n:[6,5,1,1,1,1,2,2,1,2,1,3,1,1,1,1,1,1,10,1,2,1,1],l:47},
{c:13,t:"Cambio di direzione o di corsia (svolta, inversione di marcia)",g:[546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566],n:[8,10,1,2,10,1,7,5,6,1,1,1,1,1,1,1,1,1,10,8,1],l:78},
{c:13,t:"Immissione nella circolazione e arresto sul margine",g:[567,568,569,570,571,572],n:[7,6,10,7,8,3],l:41},
{c:13,t:"Comportamento agli incroci e norme sulla precedenza",g:[573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589],n:[12,9,2,11,9,3,1,5,9,1,3,3,1,8,1,1,1],l:80},
{c:13,t:"Comportamenti per un corretto uso della strada",g:[590,591,592,593,594,595,596,597,598,599],n:[7,8,10,1,10,10,6,12,6,7],l:77},
{c:13,t:"Carico dei veicoli (1)",g:[600,601],n:[11,4],l:15},
{c:13,t:"Specchi retrovisori e loro uso",g:[602,603,604,605,606],n:[14,4,10,2,11],l:41},
{c:14,t:"Esempi di precedenza (ordine di precedenza agli incroci)",g:[607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655],n:[9,7,9,4,12,3,4,8,9,5,8,8,8,8,6,7,10,6,8,11,10,8,9,13,11,6,8,13,2,10,10,6,8,12,6,5,12,12,11,10,9,12,7,11,5,10,6,11,12],l:415},
{c:15,t:"Sorpasso",g:[656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681],n:[13,10,6,1,2,5,3,2,1,4,7,6,2,7,3,8,6,3,8,21,6,5,3,1,16,8],l:157},
{c:16,t:"Fermata, sosta, arresto e partenza",g:[682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710],n:[14,8,9,6,6,5,6,10,9,8,6,8,6,3,1,2,12,10,7,1,11,3,3,8,8,6,5,3,7],l:191},
{c:17,t:"Norme di circolazione sulle autostrade e strade extraurbane principali",g:[711,712,713,714,715,716,717,718,719],n:[8,12,5,8,1,9,2,7,5],l:57},
{c:17,t:"Ingombro della carreggiata",g:[720,721,722,723],n:[5,4,5,7],l:21},
{c:17,t:"Segnalazione di veicolo fermo (triangolo) e giubbotto retroriflettente",g:[724,725,726,727],n:[15,4,7,7],l:33},
{c:17,t:"Trasporto di persone e animali",g:[728,729,730,731],n:[9,7,6,2],l:24},
{c:17,t:"Carico dei veicoli (2)",g:[732,733,734],n:[6,8,11],l:25},
{c:17,t:"Pannelli sui veicoli (2)",g:[735,736,737,738,739,740,741,742,743],n:[14,4,1,1,1,1,2,2,2],l:28},
{c:17,t:"Traino dei veicoli in avaria - Traino dei rimorchi",g:[744,745,746,747,748,749,750,751,752,753],n:[9,6,17,10,14,12,12,10,4,4],l:98},
{c:17,t:"Conoscenza dei rischi legati alla circolazione dei veicoli - Campo visivo del conducente",g:[754,755,756,757,758,759,760,761],n:[5,9,9,3,5,6,7,6],l:50},
{c:18,t:"Uso delle luci - Catadiottri",g:[762,763,764,765,766,767,768,769,770,771,772,773,774,775,776],n:[7,7,3,3,3,3,1,8,9,8,14,11,4,8,7],l:96},
{c:18,t:"Spie e simboli",g:[777,778,779,780,781,782,783,784,785,786],n:[7,6,6,7,10,8,10,11,6,10],l:81},
{c:19,t:"Cinture di sicurezza - Airbag - Seggiolini - Poggiatesta",g:[787,788,789,790,791,792,793],n:[20,4,6,14,4,12,4],l:64},
{c:19,t:"Casco protettivo - Abbigliamento di sicurezza ",g:[794,795,796,797,798,799],n:[7,15,19,12,14,6],l:73},
{c:20,t:"Documenti di circolazione del veicolo - Targhe",g:[800,801,802,803],n:[5,8,5,1],l:19},
{c:20,t:"Patenti di guida delle categorie AM, A1, A2, A, B1, B, B+96, BE",g:[804,805,806,807,808,809,810,811],n:[12,12,13,14,9,20,10,10],l:100},
{c:20,t:"Provvedimenti disciplinari applicati alla patente di guida",g:[813,814,815,816],n:[12,16,12,21],l:61},
{c:20,t:"Patente a punti",g:[817,818],n:[16,22],l:38},
{c:20,t:"Validità e conferma della patente di guida",g:[819],n:[20],l:20},
{c:21,t:"Cause di incidenti stradali - Comportamento per prevenire incidenti e in caso di incidente",g:[820,821,822,823,824,825,826,827,828,829,830,831,832,833,834],n:[13,5,10,9,9,11,3,14,4,2,1,5,9,7,8],l:110},
{c:21,t:"Cautele alla guida di un motociclo",g:[835,836],n:[6,14],l:20},
{c:22,t:"Guida in relazione alle qualità e condizioni fisiche e psichiche - Alcool, droga e farmaci - Obbligo di lenti",g:[837,838,839,840,841,842,843,844],n:[2,8,4,5,5,10,3,8],l:45},
{c:22,t:"Primo soccorso",g:[845,846,847,848,849,850,851,852,853,854,855,856,857],n:[8,7,7,8,7,8,8,8,8,7,6,7,7],l:96},
{c:23,t:"Responsabilità civile, penale, amministrativa",g:[858,859,860,861,862,863],n:[10,6,5,7,6,10],l:44},
{c:23,t:"Assicurazione RCA - Altre forme assicurative legate al veicolo",g:[864,865,866,867,868,869,870,871,872,873],n:[4,3,6,2,8,6,4,7,6,7],l:53},
{c:23,t:"Autovalutazione del conducente e percezione del rischio. Attenzione alla guida",g:[924,925,926],n:[16,12,26],l:54},
{c:24,t:"Limitazione dei consumi. Rispetto dell’ambiente; inquinamento: atmosferico, acustico, da cattivo smaltimento dei rifiuti",g:[874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889],n:[13,4,7,7,7,8,8,8,1,2,8,3,2,9,8,8],l:103},
{c:25,t:"Elementi costitutivi del veicolo importanti per la sicurezza (pneumatici, freni, sospensioni, ammortizzatori, sterzo, scarico)",g:[890,891,892,893,894,895,896,897,898,899,900,901,902,903,904,905,906,907,908,909],n:[6,9,11,4,5,7,11,11,12,9,2,2,19,9,16,10,1,11,18,14],l:187},
{c:25,t:"Controllo nei motocicli (interruttore di emergenza, catena di trasmissione, livelli dei liquidi)",g:[910,911,912],n:[14,14,9],l:37},
{c:25,t:"Comportamenti e cautele di guida",g:[913,914],n:[6,8],l:14},
{c:25,t:"Stabilità e tenuta di strada del veicolo",g:[915,916,917,918,919,920,921,922,923],n:[5,8,4,5,6,6,6,7,2],l:49},
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