// Layout - riproduce l'interfaccia dei quiz al computer
// ver. 2.00 - agosto 2010
// var prefimg="../immagini/s";
// var lang="it"
if (nosegnale==undefined){
	var nosegnale="<div style='height:100%;cursor:default;'></div>"
}

// Non usato in mobi: var audioa = new Image().src = "grafica/n2011/spka.png";
// var ordinale=["nessun","prim","second","terz","quart","quint","sest","settim","ottav","non","decim"]
function rettitle(str){
	if (str!=null) return str.replace( /'/gi,"’")
}		
function zerofit(str,fit){
	str=str.toString()
	var ret=""
	for (var x=0; x<(fit-str.length);x++){
		ret+="0"
	}
	return ret+str
}

function separauguale(questo,quello){
	if (op.valore('txtdif')){
		if (quello==undefined) return questo
		var pquesto=questo.split(" ")
		var pquello=quello.split(" ")
		
		var ret="", lung=0
		for (var x=0;x<pquesto.length;x++){
			if (pquesto[x]!=pquello[x]){
				return  "<span class='uguale'>"+questo.substr(0,lung)+"</span><span class='diverso'>"+questo.substr(lung)+"</span>"
			}else{
				lung+=pquesto[x].length+1
			}	
		}
		return "<span class='uguale'>"+questo+"</span>"
	}else{
		return "<span class='diverso'>"+questo+"</span>"
	}	
}

var interfaccia= function(scheda, name, ridotta, minima,ih,iw){
	this.name=name
	this.riepilogo= false;
	this.correzione= false;
	this.ridotta=ridotta; // sempre true
	this.minima=minima; // argomento=true - esame=false
	this.h=ih;
	this.w=iw;
	this.confermacorr=true;
	this.scheda= scheda;
	this.scroll= -1;
	this.memscroll=0;
	this.perschermo=4; // Numero quiz mostrati per schermata (nel riepilogo)
	this.quizatt=0;
	this.decini=1; // primo valore della toolbar2
	this.schedanum="39"    // valore mostrato nella casella id =this.scheda.name+"_num"
	this.nomecand="MANTO CARMELO" // valore mostrato nella casella id =this.scheda.name+"_cand"
	this.rispdate= new Array();
	
	// FUNZIONI
	this.audio=function(img,qa,ra){
		qn=this.scheda.quesiti[qa].rispass[ra]
		var ausd=parseInt(qn/1000)
		var tmpaf= ausd+"/"+qn.toString()+"."+sext
		sofi=(audioloc[lang]==true)?("chrome://audio"+lang+"/content/"+tmpaf):(percaudio+((lang!='it')?lang+"/":"")+tmpaf)
		//this.audioimg=img
	
		try{		
			//niftyplayer('niftyPlayer1').registerEvent("onPlay", this.name+".audioonplay()")
			//niftyplayer('niftyPlayer1').registerEvent("onSongOver", this.name+".audioonstop()")
			niftyplayer('niftyPlayer1').loadAndPlay(sofi)	
		}catch(e){
			// Errore suoni
		}
		
	}
	
	
	this.correggi= function(flag){
		if (this.correzione!=true){
			if (this.confermacorr==true){
				var obj=this
				if (flag){
					var titolo='Tempo scaduto!'
					var messaggio='Il tempo massimo previsto per la prova è trascorso. Si procederà alla correzione.'
					var bottoni=Ext.Msg.OK
					var icona=Ext.MessageBox.EXCLAMATION
				}else{
					var titolo='Richiesta di conferma'
					var messaggio="Sei sicuro di voler confermare tutte le risposte date? Con 'Conferma Chiudi Esame' non avrai più la possibilità di modificarle."
					var bottoni=Ext.Msg.OKCANCEL
					//var bottoni=Ext.Msg.YESNO
					// Cambia le etichette di default
					Ext.MessageBox.buttonText.ok = "Conferma Chiudi Esame";
					Ext.MessageBox.buttonText.cancel = "Ritorna alle Domande";
					var icona=Ext.MessageBox.QUESTION
				}
				Ext.Msg.show({
   					title:titolo,
   					msg: messaggio,
   					buttons: bottoni,
   					animEl: 'elId',
   					icon: icona,
   					fn: function(btn){
   						if(btn=='ok') {
   							obj.correzione= true;
							obj.riepilogo=true
 							getWin(obj.scheda.outwin,obj.scheda.name+"_nint").innerHTML=obj.ritornacont()		
							obj.scheda.correggischeda()
								
						}									
   					}
				});
				// Ripristina le etichette di default
				Ext.MessageBox.buttonText.ok = "Ok";
				Ext.MessageBox.buttonText.cancel = "Annulla";		
							
			}else{
				this.correzione= true;
				this.riepilogo= true
				getWin(this.scheda.outwin,this.scheda.name+"_nint").innerHTML=this.ritornacont()
				this.scheda.correggischeda()
			}	
						
		}else{
			schedaprec=false
			nuovoesame() // sostituire con this.scheda.nuovo()
		}	
		
	}

	
	
	
	this.ingrandi=function(fig){
		Ext.Msg.alert("","<img class='tabriepfig ieimg' style='width:300px' src='"+prefimg+fig+".gif' />")
	}
	this.pulsante= function(label, handler, tip, pulclass){
		bakpuls="url("+pregrafica+"grafica/but1.png)" //Globale
		return "<table class='"+((pulclass==null)?"pulsante":pulclass)+"'><tr><td class='pulsante' style='height:60px; width:200px;border-width:1px;background-image:"+bakpuls+";' onmouseout='pulsout(this)'  onmouseup='pulsup(this)'  onclick='"+handler+"' title='"+tip+"'><table class='bdpul' onmouseover='pulsover(this.parentNode);this.style.border=\"1px solid #7A8A99\"' onmouseout='pulsout(this.parentNode);this.style.borderColor=\"transparent\"' onmousedown='pulsdown(this.parentNode);this.style.borderRight=\"transparent\";this.style.borderBottom=\"transparent\"' style='font-size:24px;'><td><span>"+label+"</span></td></table></td></tr></table>"
		
	}
	var bakpuls=""
	function pulsover(p){
		p.style.borderColor="#B8CFE5"
	}
	function pulsout(p){
		p.style.backgroundImage=bakpuls
		p.style.borderColor="#7A8A99"
	}
	function pulsdown(p){
		p.style.borderColor="#7A8A99"
		p.style.backgroundImage="url('"+pregrafica+"grafica/n2011/bakpulsdw.png')"
	}
	function pulsup(p){
		p.style.backgroundImage=bakpuls
	}
		
	
	this.redim=function(){
		
	}	
	this.rispondi=function(obj,x,y){
		var solut=this.scheda.quesiti[x].soluzioniutente[y]
		if (solut==null){
			solut="V"
		}else{
			if (solut=="V"){
				solut="F"
			}else{
				solut="V"
			}	
		}
		this.scheda.quesiti[x].soluzioniutente[y]=solut
		obj.src=""+pregrafica+"grafica/puls/"+solut+"X.jpg"
		
	}
	this.ritorna= function(){
		return "<div id='"+this.scheda.name+"_nint'>"+this.ritornacont()+"</div>"				
	}
	this.ritornacont= function(h,w){
		var maxris=this.scheda.maxris
		
		
		
		if (minima){
			
		}
			var rispclick
			var mostradim=""
			if (this.scheda.name=="schedaargo"){
				var barbut="<div style='background-color:#d1e6d7;'><table style='background-color:#d1e6d7;border-collapse:collapse'><tr>"+
				"<td>"+puls.create({width:250,height:100,caption:((this.correzione!=true)?"Correggi":"Continua"),fontsize:"40px",handler:"corrcontargo()"})+"</td>"+
				"<td>"+puls.create({width:100,caption:" << ",fontsize:"40px",handler:'vaiquiz(-1,"schedaargo","nuovoargo")'})+"</td>"+
				"<td>"+puls.create({width:100,caption:" >> ",fontsize:"40px",handler:'vaiquiz(+1,"schedaargo","nuovoargo")'})+"</td>"+
				"<td>"+puls.create({width:250,caption:" Vai al n... ",fontsize:"40px",handler:'vaiquiznum("nuovoargo",true)'})+"</td>"+
				"</tr></table>"
				var barbut1=barbut
			}else if (this.scheda.name=="schedasolu"){
				var barbut="<div style='background-color:#d1e6d7;'><table style='border-collapse:collapse'><tr>"+
				"<td>"+puls.create({width:100,caption:" << ",fontsize:"40px",handler:'vaiquiz(-1,"schedasolu","nuovasolu")'})+"</td>"+
				"<td>"+puls.create({width:100,caption:" >> ",fontsize:"40px",handler:'vaiquiz(+1,"schedasolu","nuovasolu")'})+"</td>"+
				"<td>"+puls.create({width:250,caption:" Vai al n... ",fontsize:"40px",handler:'vaiquiznum("nuovasolu")'})+"</td>"+
				"</tr></table>"
				var barbut1=barbut
			}else if (this.scheda.name=="schedaesame"){
				
				mostradim="display:none;"
				var barbut="<div style='background-color:#d1e6d7;'><table style='border-collapse:collapse;width:100%'><tr>"+
				"<td>"+puls.create({width:300,caption:((this.correzione!=true)?"Chiudi Esame":"Nuova Scheda"),fontsize:"40px",handler:this.name+'.correggi()'})+"</td>"+
				"<td style='text-align:right;'><span style='margin-right:4px;background-color:#fff;color:#d1e6d7;font-size:78px;font-weight:bold;text-align:center;' id='"
				var barbut1=barbut
				barbut+="tempo1'>"+this.tempo()+"</span></td>"+
				"</tr></table>"
				barbut1+="tempo2'>"+this.tempo()+"</span></td>"+
				"</tr></table>"
			}	
			var ret=""+barbut+"</div><table class='mltable' border=0 style='margin-top:20px;margin-bottom:20px;'>"

			for (x=0;x<this.scheda.maxquiz;x++){
				
				if (maxris==0) maxris=this.scheda.quesiti[x].risposte.length -this.scheda.quesiti[this.quizatt].oscurate //## Togli le oscurate (che sono in fondo così non vengono mostrate)
				
				var fig=+this.scheda.quesiti[x].segnale
				if (this.scheda.name=="schedaesame"){
					domanda="Domanda numero "+(x+1)
				}else{
					if (op.valore('nasdom'))
						domanda="Gruppo numero"
					else	
						domanda=this.scheda.quesiti[x].domanda+"</b> <span style='font-size: 0.7em'>["+this.scheda.quesiti[x].nummin+"]</span>";	
				}
				
						
				ret+="<tr><td style='border:4px solid #d1e6d7'><table class='mltable' border=0>"
				
				// Riga ampliamento
				ret+="<tr id='qp"+this.scheda.name+x+"' style='"+mostradim+"'><td colspan=2 style='background-color:#d1e6d7;height:100px;' sonclick='"+this.name+".toggqp("+x+")'>"+
				"<table class='mltable'><tr><td style='width:400px;font-size:20px;'><b>"+domanda+"</b></td><td style='padding-right:10px;'>"+
				
				((nosugg==true)?"":"<div style='float:right;margin-left:5px;'>"+puls.create({width:100,caption:"<img class='blockimg' src='"+pregrafica+"grafica/puls/h.png' style='width:60px;' />",handler:'mostrasuggerimenti('+this.scheda.quesiti[x].sugg+')'})+"</div>")+
				((this.scheda.name=="schedasolu")?"":"<div style='float:right;margin-left:5px;'>"+puls.create({width:100,caption:"<img class='blockimg' src='"+pregrafica+"grafica/puls/s.png' style='width:60px;' />", handler:'mostrasoluzioni('+this.scheda.quesiti[x].numero+')'})+"</div>")+
				((this.scheda.name!="schedaesame")?"<div style='float:right'>"+puls.create({width:100,caption:"<img class='blockimg' src='"+pregrafica+"grafica/puls/xaudio.png' />",handler:'Ext.Msg.alert(\"Per tua informazione\",\"Tocca il testo di ciascun quesito per ascoltarne la lettura.\")'})+"</div>":"<div style='float:right'>"+puls.create({width:100,caption:"<img class='blockimg' src='"+pregrafica+"grafica/puls/xaudio.png' />",handler:this.name+'.audio(null,'+x+','+this.scheda.quesiti[x].ordine[0]+')'})+"</div>")+
				"</td></tr></table>"+
				"</td></tr>"
				// Figura ingrandita
				if (fig>0){
					ret+="<tr id='ii"+this.scheda.name+x+"' style='display:none;'><td colspan=2 style='' onclick='"+this.name+".toggle("+x+",\"ii\")'><img class='blockimg' class='tabriepfig ieimg' style='width:100%' src='"+prefimg+fig+".gif' alt=''/></td></tr>"
				
				// Figura
					ret+="<tr><td class='mlimg'>"
					ret+=((fig>0)?"<img class='blockimg' class='tabriepfig ieimg' style='height:120px' src='"+prefimg+fig+".gif' onclick='"+this.name+".toggle("+x+",\"ii\")' alt=''/></a>":"<img class='blockimg' class='' style='height:120px' src='"+prefimg+"0.gif' alt=''/>")
					ret+="</td><td style='vertical-align:top'>"
				}else{
					ret+="<tr><td style='vertical-align:top'>"
				}
				// Risposte e VF	
				
				ret+="<table  class='mltable' border=0>"
				var bkr=""//##
				var tmpbkr=" style='text-decoration:line-through;color:#bbb;' title='Quiz cancellato e non più proposto negli esami' "; //##
				var tmpqn=(quiznasc.indexOf("|"+this.scheda.quesiti[this.quizatt].numero+"|")!=-1)?true:false //## Determina se tutto il quiz è oscurato
				
				for (y=0;y<maxris;y++){
					if (this.scheda.name=="schedasolu"){//##
						if (tmpqn || nascosta(this.scheda.quesiti[this.quizatt].numero,y)) bkr=tmpbkr; else bkr=""; //## Se il quiz o la singola risposta è oscurata
					}//##
					rispclick=(this.scheda.name=="schedaesame")?this.name+".toggqp("+x+")":this.name+".audio(null,"+x+","+this.scheda.quesiti[x].ordine[y]+")"
					ret+="<tr><td style='font-size:22px;font-family:arial,helvetica,sans;' onclick='"+rispclick+"'><span"+bkr+">" +((this.scheda.name=="schedaesame")?x+1:y+1)+". "+this.scheda.quesiti[x].risposte[this.scheda.quesiti[x].ordine[y]]+"</span></td>"
					ret+="<td class='mlvf'>"+this.verofalso(x,y,120,120,(bkr!=""))+"</td></tr>"
				}
				ret+="</table></td></tr>"
				
				ret+="</table></td></tr>"	
			
			} // for
			ret+="</table>"+barbut1
	
		return ret
	}
	this.tempo=function(){
		return tempo=zerofit(this.scheda.minuti,2)+":"+zerofit(this.scheda.secondi,2)
	}

	this.toggqp=function(x){
		var obj=document.getElementById("qp"+this.scheda.name+x)
		if (obj.style.display=="none"){
			obj.style.display="table-row"
		}else{
			obj.style.display="none"
		}
	}
	this.toggle=function(x,oname){
		var obj=document.getElementById(oname+this.scheda.name+x)
		if (obj.style.display=="none"){
			obj.style.display="table-row"
		}else{
			obj.style.display="none"
		}
	}

	this.verofalso= function(x,y, hv, hf, nasc){
		var ret="";
		var solut=this.scheda.quesiti[x].soluzioniutente[y]
		if (solut==null) solut="N"
		if (this.correzione==false){
			if (op.valore("defvero")==true){
				solut="V"
				this.scheda.quesiti[x].soluzioniutente[y]="V"
			}	
			ret="<img class='vf ieimg' id='"+this.scheda.name+x+y+"VF'  style='height:"+hv+"px' src='"+pregrafica+"grafica/puls/"+solut+"X.jpg' onclick='"+this.name+".rispondi(this,"+x+","+y+")' />"
		}else{
			var sol=this.scheda.quesiti[x].soluzioni.charAt(this.scheda.quesiti[x].ordine[y])
			var vf=''
			var title=''
			if (solut!="N"){
				if (solut==sol){
					if (solut=="V") {vf="XES"; title="Soluzione esatta: VERO";}else{vf="XES"; title="Soluzione esatta: FALSO";}
				}else{
					if (solut=="V") {vf="XER"; title="Si è risposto VERO ma la soluzione esatta è FALSO";}else{vf="XER"; title="Si è risposto FALSO ma la soluzione esatta è VER0";}
				}	
			}else{
				if (this.scheda.name=="schedasolu"){
					if (nasc!=true)
						if (sol=="V") {title="La soluzione esatta è: VERO";} else {title="La soluzione esatta è: FALSO";}
					else
						title="Quiz cancellato e non più proposto negli esami";
				}else
					if (sol=="V") {title="Non si è risposto; la soluzione esatta è: VERO";} else {title="Non si è risposto; la soluzione esatta è: FALSO";}
							
				solut=sol
				var vf='X'
			}
			ret="<img class='vf ieimg'  style='height:"+hv+"px' src='"+pregrafica+"grafica/puls/"+solut+vf+".jpg' onclick='Ext.Msg.alert(\"Per tua informazione\",\""+title+"\")' />"
			
			
		}	
		return ret
	}	
	
	this.aggiornaTempo=function(tempoval){
		dum=document.getElementById("tempo1")
		if (dum!=null) dum.innerHTML=this.tempo()
		dum=document.getElementById("tempo2")
		if (dum!=null) dum.innerHTML=this.tempo()
	}
}
