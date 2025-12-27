document.onreadystatechange = function(){
	if (document.readyState === 'complete') {
    	Ext.onReady()
	}
};

var tastp=[]
function tastprem(c){
	var dum=document.getElementById('inp')
	if (dum!=null){
		if (c=="C")
			dum.innerHTML=""
		else if (c=="CE")
			dum.innerHTML=dum.innerHTML.substring(0,dum.innerHTML.length-1)
		else{
			if (dum.innerHTML.length<3) dum.innerHTML+=c;
		}	
	}
}

function tastieranum(){	
	var out="<table style='margin:auto;margin-top:20px;background-color:#d1e6d7;border:3px solid #d1e6d7;'><tr><td colspan='3' style='height:100px;text-align:center'>"
	out+="<div id='inp' name='inp' style='background-color:#fff;border:1px solid;width:200px;margin:auto;height:70px;font-size:50px;line-height:70px;'></div></td></tr><tr>"
	var tastc= ["1","2","3","4","5","6","7","8","9","0","CE","C"]
	//for (x in tastc){
	for (x=0;x<12;x++){
		if ((x % 3)==0)
			if (x!=0) out+="</tr><tr>"
			tastp[x]= new puls2({name:"tastp["+x+"]", caption:tastc[x], width:"100", handler:tastprem,par:tastc[x]});
			
		out+="<td>"+tastp[x].show()+"</td>"
	}
	out+="</tr></table>"
	return out
}


var msgpuls = new Array()
puls2= function(p){
	this.name=(p.name!=null)?p.name:"puls2"
	this.height=(p.height!=null)?p.height:100
	this.width=p.width
	this.iwidth=0
	this.caption=(p.caption!=null)?p.caption:"Ok"
	this.fontsize=(p.fontsize!=null)?p.fontsize:"50px"
	this.handler=(p.handler!=null)?p.handler:'alert("Hai fatto click su '+p.caption+'")'
	this.bg=(p.bg!=null)?p.bg:""
	this.par=(p.par!=null)?p.par:""
	this.xstyle=(p.xstyle!=null)?p.xstyle:""
	//if (this.width==null){
		if (p.caption.length<10){
			this.width=100
		}else{
			this.width=100*	Math.ceil(p.caption.length/9)
			this.fontsize="40px"
		}
	//}		
	this.iwidth=this.width-20
	
	this.show= function(p){	
		return "<table class='unselectable' style='height:"+this.height+"px;swidth:"+this.width+"px;border-collapse:collapse;cursor:default;"+this.xstyle+"' "+
		"onclick='"+this.name+".pulsclick()' onmouseover='"+this.name+".pulsover(this)' onmouseout='"+this.name+".pulsout(this)' onmousedown='"+this.name+".pulsdown(this)' onmouseup='"+this.name+".pulsout(this)'><tr>"+
		"<td style='width:10px;background-image:url("+pregrafica+"grafica/puls/pulSX"+this.bg+".png);background-size:100% 100%;padding:0px;'></td>"+
		"<td style='width:"+this.iwidth+"px;background-image:url("+pregrafica+"grafica/puls/pulCX"+this.bg+".png);background-repeat:repeat;background-size:100% 100%;padding:0px;text-align:center;font-size:"+this.fontsize+";font-family:Arial, Verdana'>"+
		"<div class='unselectable'style='line-height:85%'>"+this.caption+"</div></td>"+
		"<td style='width:10px;background-image:url("+pregrafica+"grafica/puls/pulDX"+this.bg+".png);background-size:100% 100%;padding:0px;'></td></tr></table>"
	},
	this.pulsclick= function(){
		this.handler(this.par)
	},
	this.pulsover= function(table){
		var cells = table.getElementsByTagName("td"); 
		cells[0].style.backgroundImage="url("+pregrafica+"grafica/puls/pulSXO"+this.bg+".png)"
		cells[1].style.backgroundImage="url("+pregrafica+"grafica/puls/pulCXO"+this.bg+".png)"
		cells[2].style.backgroundImage="url("+pregrafica+"grafica/puls/pulDXO"+this.bg+".png)"
	},
	this.pulsout= function(table){
		var cells = table.getElementsByTagName("td");
		cells[0].style.backgroundImage="url("+pregrafica+"grafica/puls/pulSX"+this.bg+".png)"
		cells[1].style.backgroundImage="url("+pregrafica+"grafica/puls/pulCX"+this.bg+".png)"
		cells[2].style.backgroundImage="url("+pregrafica+"grafica/puls/pulDX"+this.bg+".png)"
	},
	this.pulsdown= function(table){
		var cells = table.getElementsByTagName("td");
		cells[0].style.backgroundImage="url("+pregrafica+"grafica/puls/pulSXD"+this.bg+".png)"
		cells[1].style.backgroundImage="url("+pregrafica+"grafica/puls/pulCXD"+this.bg+".png)"
		cells[2].style.backgroundImage="url("+pregrafica+"grafica/puls/pulDXD"+this.bg+".png)"
	}
	return this
}	



var puls={
	create: function(p){
		this.width=(p.width!=null)?p.width:100
		this.height=(p.height!=null)?p.height:100
		this.caption=(p.caption!=null)?p.caption:"OK"
		this.fontsize=(p.fontsize!=null)?p.fontsize:"50px"
		this.handler=(p.handler!=null)?p.handler:'alert("Hai fatto click su '+p.caption+'")'
		this.bg=(p.bg!=null)?p.bg:""
		this.xstyle=(p.xstyle!=null)?p.xstyle:""
		var cw=this.width-20
		return "<table class='unselectable' style='height:"+this.height+"px;width:"+this.width+"px;border-collapse:collapse;cursor:default;"+this.xstyle+"' "+
		"onclick='"+this.handler+"' onmouseover='puls.pulsover(this)' onmouseout='puls.pulsout(this)' onmousedown='puls.pulsdown(this)' onmouseup='puls.pulsout(this)'><tr>"+
		"<td style='width:10px;background-image:url("+pregrafica+"grafica/puls/pulSX"+this.bg+".png);background-size:100% 100%;padding:0px;'></td>"+
		"<td style='width:"+cw+"px;background-image:url("+pregrafica+"grafica/puls/pulCX"+this.bg+".png);background-repeat:repeat;background-size:100% 100%;padding:0px;text-align:center;font-size:"+this.fontsize+";font-family:Arial, Verdana'>"+
		"<div class='unselectable'>"+this.caption+"</div></td>"+
		"<td style='width:10px;background-image:url("+pregrafica+"grafica/puls/pulDX"+this.bg+".png);background-size:100% 100%;padding:0px;'></td></tr></table>"
	},
	
	pulsover:function(table){
		var cells = table.getElementsByTagName("td"); 
		cells[0].style.backgroundImage="url("+pregrafica+"grafica/puls/pulSXO"+this.bg+".png)"
		cells[1].style.backgroundImage="url("+pregrafica+"grafica/puls/pulCXO"+this.bg+".png)"
		cells[2].style.backgroundImage="url("+pregrafica+"grafica/puls/pulDXO"+this.bg+".png)"
	},
	pulsout:function(table){
		var cells = table.getElementsByTagName("td");
		cells[0].style.backgroundImage="url("+pregrafica+"grafica/puls/pulSX"+this.bg+".png)"
		cells[1].style.backgroundImage="url("+pregrafica+"grafica/puls/pulCX"+this.bg+".png)"
		cells[2].style.backgroundImage="url("+pregrafica+"grafica/puls/pulDX"+this.bg+".png)"
	},
	pulsdown:function(table){
		var cells = table.getElementsByTagName("td");
		cells[0].style.backgroundImage="url("+pregrafica+"grafica/puls/pulSXD"+this.bg+".png)"
		cells[1].style.backgroundImage="url("+pregrafica+"grafica/puls/pulCXD"+this.bg+".png)"
		cells[2].style.backgroundImage="url("+pregrafica+"grafica/puls/pulDXD"+this.bg+".png)"
	}
}	

var Ext={
	onReady: function(p){
		this.onReady=p;
	},
	winreg: {
		arr: [], obj:[], scr: [],
		count:0,
		add:function(o,d){
			var i=this.arr.length;
			this.arr[i]=d; 
			this.obj[i]=o;
			this.scr[i]=0;
			this.count++
			return i;
		},
		del:function(i){
			this.arr.splice(i,1);
			this.obj.splice(i,1);
			this.scr.splice(i,1);
			return this.arr.length;
		},
		getnum:function(){return this.count},
		getref:function(i){return this.arr[i]},
		getobj:function(i){return this.obj[i]},
		len:function(){return this.arr.length}
	},
	
	Action: function(a){ // Per ora Action ?olo un sinonimo di button
		this.inheritFrom = Ext.button
		this.inheritFrom(a)
		this.type="Action"
	
		return this
	},
	br2cr: function(s){
		return s.replace(/<br\/>/gi, '\n');
	},
	button: function(p){
		this.id=p.id
		this.text=p.text
		this.icon=p.icon
		this.image=p.image
		this.handler=p.handler
		this.menu= p.menu
		this.tooltip=p.tooltip
		this.hidden= p.hidden
		this.win=p.win
		this.setIconClass= function(c){ // Da completare
			this.image=pregrafica+"grafica/flags/"+c+".gif" // (va aggiornato anche se non ?ostrata per la prossima apertura)
			if (this.win!=null) {
				if (this.win.handle!=null) {
					this.win.handle.document.getElementById(this.id).setAttribute("image", this.image)
				}	
			}	
		}
		this.setText=function(t){
			this.text=t
			if (this.win!=null) {
				if (this.win.handle!=null) {
					//dum=this.win.handle.document.getElementById(this.id)
					//dum.setAttribute("label",t)
				}
			}	
		}
		return this
	},
	
	example: {
		msg: function(t,m){
				//alert(m);
				/*
				mobimsg.setTitle(t)
				mobimsg.show()
				document.getElementById('panmsg').innerHTML="<table style='width:100%'><tr><td style='height:100px;text-align:center;font-size:50px'>"+m+"</td></tr><tr><td style='text-align:center'>"+puls.create({width:200,caption:" Ok ",handler:"mobimsg.hide()",xstyle:"margin:auto;" })+"</td></tr>"
				*/
				Ext.Msg.show({title:t,msg:m,buttons:Ext.Msg.OK})
		}
	},
	
	
	MessageBox:{
		
		buttonText : {
            	ok : "Ok",
            	cancel : "Annulla",
            	yes : "Sì",
            	no : "No"
        	},
		confirm: function(t,m,f){
			Ext.Msg.show({title:t,msg:m,fn:f,buttons:Ext.Msg.YESNO})
			//result = (confirm(m))?"yes":"cancel";
			//f(result)
		},
		prompt: function(t,m,f){
			//Ext.Msg.show({title:t,msg:m+"<input id='inp' type='text' style='width:100%' />",buttons:Ext.Msg.OKCANCEL,fn:function(par){f(par,document.getElementById("inp").value)}})
			Ext.Msg.show({title:t,msg:m+tastieranum(),buttons:Ext.Msg.OKCANCEL,fn:function(par){f(par,document.getElementById("inp").innerHTML)}})   			                                                                                                                                                                             	                                                                                                                                                                             
			//input={value: ""}
			//result=(prompts.prompt(getMRWin(), t, m, input, null, {value: null}))?"ok":"cancel"
			//f(result,input.value)

		},
		show: function(p){
			if (p.progress==true)
			p.msg+="<div id='progdiv' style='font-weight:bold'></div>"
			Ext.Msg.show(p)
		},
		hide: function(){
			if (this.updateExist==true){
				document.body.removeChild(this.winmsg.handle)
				this.updateExist=false
			}
			mobimsg.hide()
		},
		updateProgress: function(i,msg){
						document.getElementById('progdiv').innerHTML="<div style='height:1.3em;'><div style='width:"+(i*100)+"%;height:1.3em;background-color:#00aa00;position:relative;top:0px;left:0px;z-index:0;'>&nbsp;</div><div style='position:relative;height:1.3em;top:-1.3em;left:0px;z-index:2;'>"+msg+"</div>"
			/*if (!this.updateExist){
				this.winmsg.show()
				Ext.MessageBox.updateExist=true
			}
			
			this.winmsg.handle.innerHTML="<table class='msg'><tr><td class='msg'>"+msg+"</td></tr></table>";
			*/
		},
		updateExist: false,
		winmsg:{
			show: function(){
				var nuovoDiv = document.createElement("div");
				//nuovoDiv.setAttribute("class","msg");
				document.body.appendChild(nuovoDiv)
				this.handle=nuovoDiv
			},
			hide: function(){
				document.body.removeChild(this.handle)
			},
			handle: null
		},
		OK: ['ok'],
		QUESTION: ''
	
	},
	Msg:{
		YESNO: ['yes','no'],
		OKCANCEL: ['ok','cancel'],
		OK: ['ok'],
				
		alert: function(title,msg){
			
			Ext.Msg.show({title:title,msg:msg,fn:function(){},buttons:['ok']})
			/*
			Ext.MessageBox.winmsg.show()
			if (window.orientation){
				if (window.orientation==0)
					var sw=screen.height;
				else
					var sw=screen.width;
			}else
				var sw=screen.height;
			Ext.MessageBox.winmsg.handle.innerHTML="<table style='position:fixed;width:100%;height:100%;top:0px;border:3px solid red' class=''><tr><td class='msg'>"+msg+"<input type='button' value='OK' onclick='Ext.MessageBox.winmsg.hide()'></td></tr></table>";
			*/

		},
		show: function(p){
			if (p.fn==null) p.fn=function(){}
			//p.msg=Ext.br2cr(p.msg)
			mobimsg.onclose=p.onclose;	
			mobimsg.setTitle(p.title)
			mobimsg.show()
			var ret="<table style='width:100%;'><tr><td style='height:100px;text-align:left;font-size:50px'><div style='margin-bottom:20px;'>"+p.msg+"</div></td></tr>"
			if (p.buttons!=null){
				ret+="<tr><td style='text-align:center;background-color:#d1e6d7;'>"
				if (p.buttons.length!=null){
					ret+="<table style='margin:auto;'><tr>"
					for (x=0;x<p.buttons.length;x++){
						msgpuls[x]=new puls2({name:"msgpuls["+x+"]",width:200,caption:Ext.MessageBox.buttonText[p.buttons[x]],handler:Ext.Msg.result,par:{fn:p.fn,par:p.buttons[x]},xstyle:"margin:auto;" })
						ret+="<td>"+msgpuls[x].show()+"</td>"
					}
					ret+="</tr></table>"
				}else{
					msgpuls[0]=new puls2({name:"msgpuls[0]",width:200,caption:p.buttons.yes,handler:Ext.Msg.result,par:{fn:p.fn,par:"yes"},xstyle:"margin:auto;" })
					ret+=msgpuls[0].show()
					msgpuls[1]=new puls2({name:"msgpuls[1]",width:200,caption:p.buttons.cancel,handler:Ext.Msg.result,par:{fn:p.fn,par:"cancel"},xstyle:"margin:auto;" })
					ret+=msgpuls[1].show()
					msgpuls[2]=new puls2({name:"msgpuls[2]",width:400,caption:p.buttons.no,handler:Ext.Msg.result,par:{fn:p.fn,par:"no"},xstyle:"margin:auto;" })
					ret+=msgpuls[2].show()		
				}
				ret+="</td></tr>"
			}
			ret+="</table>"
			document.getElementById('panmsg').innerHTML=ret
			
		},
		hide: function(){
		},	
		result: function(par){
			mobimsg.hide()
			par.fn(par.par)
		}
	},

	menu:{
		Menu: function(){
			this.menuitem = new Array();
			this.addMenuItem= function(m){
				this.menuitem[this.menuitem.length]=m
			}
			return this	
		}
	},
	Panel: function(p){
		this.type="pan";
		this.autoscroll=p.autoscroll;
		this.height=p.height;
		this.title=p.title;
		this.html=p.html;
		this.listeners=p.listeners;
		this.contentEl=p.contentEl;
		this.win=p.win	
		this.num=p.num
		this.wpselectable=p.wpselectable
		this.setTitle= function(t){
			this.title=t;
			var lab=document.getElementById("w_"+this.win.num+"_lab"+this.num)
			lab.innerHTML=t
			/*
			var oldlabcont=lab.childNodes[0];
			lab.removeChild(oldlabcont); 
			var newlabcont = document.createTextNode(t)
			lab.appendChild(newlabcont)
			*/
		}

		return this	
	},
	
	select: function(id){
		this.id=id
		this.setStyle=function(s,v){
			return
			if(id.charAt(0)=="."){
				 for(j=0;j<winesame.handle.document.getElementsByClassName(id.substr(1)).length;j++)
				 	eval("winesame.handle.document.getElementsByClassName('"+id.substr(1)+"')[j].style."+s+"='"+v+"'")
			}
			
			
		}
		return this
	},
	
	TabPanel: function(p){
		this.type="tab"
		this.id=p.id;
		this.height=p.height;
		this.activeTab=p.activeTab;
		this.items=p.items;
		this.listeners=p.listeners;
		this.win=p.win	
		this.num=p.num
		this.setActiveTab = function(tab){
			this.activeTab=tab
		}
		this.getActiveTab = function(){
			return this.items[this.activeTab]
		}	
		this.onev=function(tabtitle,tab){
			alert("tab-onev")
			this.setActiveTab(tab)
			if((tabtitle=="Esame") || (tabtitle=="Argomento")) 
				opener.mostraris(tab) //<--**
			else
				opener.mostraopz(tab)
					
		}	
		this.on=function(tipoev, manev){
		
		}
		return this	
	},
	
	Window: function(p){
		this.height=p.height;
		this.width=p.width;
		this.winmax=p.winmax;
		this.x=p.x;
		this.y=p.y;
		this.title=(p.title==undefined)?"senza titolo":p.title;
		if (this.title==ver.app+" - Start"){ 
			if (ver.abb.substr(0,5)=="wps44")
				this.title="<span style='font-size:60px;'>WEBpatente</span> <span style='font-size:30px;'>"+ver.info.patenti+"</span>"
			else
				this.title="<span style='font-size:60px;'>"+ver.app+"</span>"
		}else{
			titlen=ver.app.length+3
			if (this.title.substring(0,titlen)==ver.app+" - ") this.title=this.title.substring(titlen)
		}
		this.pack=(p.buttonAlign=="center")?"center":((p.buttonAlign=="right")?"end":"start");
		
		this.items=p.items
			for (i=0;i<p.items.length;i++){
				p.items[i].win=this
				p.items[i].num=i
			}
		this.buttons=new Array();
		this.listeners=p.listeners;
		this.fignum=p.fignum;
		this.handle=p.handle;
		this.hw=null;
		this.hidden=true;
		this.contenuto="";
		this.winstato=0;
		this.myref=null;
		this.num=null
		this.modal=p.modal
		this.show= function(){
			ultimo=Ext.winreg.len()-1
			if (ultimo >=0){
				Ext.winreg.scr[ultimo]=window.pageYOffset
			}
			//alert(window.pageYOffset)
			var tuttidiv = document.getElementsByTagName("div"); 
			for (var i = 0; i < Ext.winreg.len(); i++) { 
				Ext.winreg.getref(i).style.display="none"
			}	
			this.hidden=false;
			window.scrollTo(0,0);
			if (this.handle==undefined){
				var nuovoDiv = document.createElement("div");
				nuovoDiv.setAttribute("class","viewport");
				
				this.myref=Ext.winreg.add(this,nuovoDiv);
				this.num=Ext.winreg.getnum()
				nuovoDiv.setAttribute("id","win_"+Ext.winreg.getnum());
				var conte=""
				if (autopers==true) conte=persheader; // HEADER PERSONALIZZATO
				if ((this.myref!=0) || (this.modal==true)){
  					//var conte = "<table class='graf'><tr><td class='intest graf' id='w_"+this.myref+"_tit'>"+this.title+"</td><td class='graf' style='width:100px'><div style='background-color:#fff;padding:2px'>"+puls.create({width:96,caption:"<img class='blockimg' src='"+pregrafica+"grafica/puls/xclose.png' />",handler:"Ext.winreg.getobj("+this.myref+").hide()" })+"</div></td></tr></table>";
  					
  					conte+= "<table class='graf'><tr><td class='intest graf' id='w_"+this.myref+"_tit'><div  class='mobitit'>"+this.title+"</div></td><td class='graf' style='width:100px'><div style='background-color:#fff;padding:2px'>"+puls.create({width:96,caption:"<img  class='blockimg' src='"+pregrafica+"grafica/puls/xclose.png' />",handler:"Ext.winreg.getobj(Ext.winreg.len()-1).hide()" })+"</div></td></tr></table>";
  				}else{ // Finestra principale
  					conte+= "<table class='graf'><tr><td class='intest graf'><div class='mobitit'>"+this.title+"</div></td><td class='graf' style='width:100px'><div style='background-color:#fff;padding:2px'>"+puls.create({width:96,caption:"<img  class='blockimg' src='"+pregrafica+"grafica/puls/xgear.png' />",handler:"mostraopzioni(0)" })+"</div></td></tr></table>";
  				}	
  				conte+="<div class='corpoprinc'>"
  				for (i=0;i<this.items.length;i++){
  					
  					if (this.items[i].type!="tab"){
  						conte+=(this.items[i].title!=null)?"<div class='panlab' id='w_"+this.num+"_lab"+this.items[i].num+"'>"+this.items[i].title+"</div>":"";
  						if (this.items[i].html==null){
  							if (this.items[i].contentEl!=null)
  								conte+=document.getElementById(this.items[i].contentEl).innerHTML
  						}else
  							conte+="<div>"+this.items[i].html+"</div>";
  					}else{ //Tab
  						var j=this.items[i].activeTab
  						
  						for (j=0;j<this.items[i].items.length;j++){
  							conte+=(this.items[i].items[j].title!=null)?"<div class='panlab' id='lab"+this.items[i].items[j].num+"'>"+this.items[i].items[j].title+"</div>":"";
  							if (this.items[i].items[j].html==null){
  								//alert(this.items[i].items[j].contentEl)
  								conte+="<div class='"+this.items[i].items[j].contentEl+"'>"+document.getElementById(this.items[i].items[j].contentEl).innerHTML+"</div>"
  							}else	
  								conte+="<div>"+this.items[i].items[j].html+"</div>";    	
  						}
  					}		

  				}
  				// Aggiungi banner
  				conte+="<div id='conban'>"
  				//conte+="<iframe id='banspa' src='//www.rmastri.it/42/webpatente/mobiban.htm' frameborder='0' scrolling='no' style='margin-top:20px;'></iframe>";
  				if (autopers==true)
  					conte+=persfooter; // FOOTER PERSONALIZZATO
  				else{
  					if ((this.myref!=0) || (this.modal==true))
  						conte+="<iframe id='banspa' src='"+ban+"' frameborder='0' scrolling='no' style='margin-top:20px;'></iframe>";
  					else{ // Finestra principale
  						// Per tutte le patenti superiori si usa il file di c1c1e
  						conte+="<iframe id='banspa' src='"+((ver.abb.substr(0,5)=="wps44")?"../quiz-c1c1e/":questapat)+"mobioff.htm' frameborder='0' scrolling='no' style='margin-top:20px;'></iframe>";
  					}	
  				}
  				conte+="</div></div>"; //due div: l'ultimo chiude corpoprinc
  				nuovoDiv.innerHTML=conte;
				document.body.appendChild(nuovoDiv)
				this.handle=nuovoDiv
								
				eval('nuovoDiv.addEventListener("load",function(){alert("load")},false)')
				eval('nuovoDiv.addEventListener("close",function(){alert("close")},false)')
				
			}else{
				//this.handle.focus()
				//aggiornacontenuto(this.title)	
				this.myref=Ext.winreg.add(this,this.handle);
				this.handle.style.display=""
			}
			//alert(this.myref)
			if (this.title.lastIndexOf("Risultati")!=-1){
				mostraris(0)
				mostraris(1)
			}	
			
		},
		this.setPosition= function(x,y){
			this.handle.win1func("window.moveTo("+x+","+y+")") 		
		},
		this.setTitle= function(nt){
			this.title=nt
			if (document.getElementById("w_"+this.myref+"_tit")!=null)
				document.getElementById("w_"+this.myref+"_tit").innerHTML=nt
		},
		this.maximize=function(){
			//Wrapper
		},
		this.toggleMaximize= function(){
			if (this.winstato==0){
				this.winstato=1
				//this.handle.win1func("window.maximize()")
				this.listeners.maximize()
				//this.listeners.resize(this)
			}else{
				this.winstato=0
				//this.handle.win1func("window.restore()")
				this.listeners.restore()
				//this.listeners.resize(this)
			}	
		},
		this.getInnerWidth= function(){
			if (this.handle!=null)
				return "800px";
				//return this.handle.win1func("window.innerWidth")-10 //Conf funzione in win.xul
		},
		this.getInnerHeight= function(){
			if (this.handle!=null)
				return "800px";
				//return this.handle.getInnerHeight()
		},
		this.hide= function(){
			if (this.hidden==true) return //è già nascosta

			if ((this.myref==0)&& (this.modal!=true)) {
				if (confirm("Vuoi chiudere davvero?")){
					document.location="//www.rmastri.it/"
				}
				return
			}
			if (this.title=="Opzioni") op.aggiorna() // Le opzioni sono modificate quando la finestra è chiusa
			
			this.hidden=true;
			if (this.handle!=null){ //Se non è nascosta
				this.handle.style.display='none'; // Nascondi la finestra 
				//this.handle=null;    // Cancella l'handle perch?a finestra ?hiusa
				var mostra=Ext.winreg.del(this.myref)-1
				if (Ext.winreg.getref(mostra)!=null) Ext.winreg.getref(mostra).style.display=""

			}
			// Ripristina la posizione della finestra sottostante
			if (Ext.winreg.len()-1>=0) window.scrollTo(0,Ext.winreg.scr[Ext.winreg.len()-1])	
			
			if (typeof this.onclose=="function")
			this.onclose()
		}
		
		if (p.buttons!=null){
			for (i=0;i<p.buttons.length;i++){
				if ((p.buttons[i].type!=null) && (p.buttons[i].type=="Action")) {
					this.buttons[i]=p.buttons[i]
				}else
					this.buttons[i] = new Ext.button(p.buttons[i])
				this.buttons[i].win = this
			}
		}
		return this
	}
	
	
	
}

var panmsg = new Ext.Panel({
		html: '<div id="panmsg"></div>'			
})
var mobimsg = new Ext.Window({
		title: 'WEBpatente',
		items:[panmsg],
		modal:true
})

//WRAPPERS derivati da wpnojs.js

// Variabili per la versione JavaScript

var sext = "mp3"                         // Prima definizione - Estensione effetti sonori

var percsuoni=presuoni+"suonimp3/"	     // Prima definizione - Percorso della cartella degli effetti sonori  (suoni/ per versione xul)

var prefimg=pregrafica+"../immagini/s";  // Percorso delle figure

var perpers=""                           // Non usato nella versione js

var percaudio=presuoni+ "../audio/"      // Percorso dei file audio remoti

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
	/* aggiungi figura in mobi */
	var dum=""
	if (suggerimento.segnale>0) dum="<div class='contfig'><img class='figura' src='"+prefimg+suggerimento.segnale+".gif' onclick='ingrandisci("+suggerimento.segnale+")' title='Figura nr. "+suggerimento.segnale+". Fare click per ingrandire.' /></div>";
			
	getWin(winsugg,'pansugg').innerHTML=dum+suggerimento.testo+testipla+aiuto+"</div>"; // Questo div è necessario
	pansugg.setTitle(suggerimento.titolo);
}
function suggeC(){ //Nuova
	getWin(winsugg,'pansugg').innerHTML=LZString.decompress(suggerimento.testo)+testipla+aiuto+"</div>"; // Questo div è necessario
	pansugg.setTitle(suggerimento.titolo);
}
function lezione(numlez){
	nuovalez(numlez)
}
function argoesame(){
	mostraesargo()
}
function errori(){ //Nuova
	mostraerrori()
}
function getWin(win,id){
	//Cerca l'id dentro il div della finestra
	//attenzione. querySelector ha compatibilità limitata
	return (win.handle).querySelector("#"+id)
}

function rimuoviscript(sid){
	oldjs=document.getElementById(sid)
 	if (oldjs!=null) {
 		document.body.removeChild (oldjs);
 	}
} 

function creascript(sid,ssrc){
  	sh = document.createElement('SCRIPT');
  	sh.setAttribute("type","text/javascript");
  	sh.setAttribute("id",sid);
  	sh.setAttribute("src",ssrc);
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

function openbrowser(urltogo){
	open(urltogo)
}

function commuta(p,s){
	return eval(p+".commuta('"+s+"')")
}

function aggiornabanner(){
	if (autopers!=true) {// Il banner non si aggiorna nelle personalizzazioni
		if (offtype=="andro"){
			if(interjs.neton()==true) 
				document.getElementById('banspa').src=ban
		}else
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

/*
function salva(wp4rul){
	var burl=document.location.toString()
	var interr=burl.indexOf("?")
	if (interr!=-1)	burl=burl.substr(0,interr)
	var dumtxt="<body style='background-color:#fff'><div style='text-align:center;font-family:verdana,arial;font-size:40px;width:800px;'>"+
	"<b>Salva il link o aggiungilo ai preferiti</b><br/><br/>"+
	"Link per aprire la scheda con WEBpatente per smartphone e tablet:<br/>"+
	"<a href='"+burl+"?E"+wp4url+"'>"+burl+"?E"+wp4url+"</a><br /><br />"+
	"<div><form action='//tinyurl.com/create.php' method='post' target='_blank'>"+
	"<input type='hidden' name='url' size='30' value='"+burl+"?E"+wp4url+"' style='width:100%'>"+
	"<input type='submit' name='submit' value='Crea un link più corto con TinyURL!' style='font-size:30px;height:100px'></form></div>"+
	"Link per aprire la scheda con WEBpatente per PC:<br/>"+
	"<a href='//www.rmastri.it/quiz-patente-b.php?E"+wp4url+"'>//www.rmastri.it/quiz-patente-b.php?E"+wp4url+"</a><br /><br />"+
	"<div><form action='//tinyurl.com/create.php' method='post' target='_blank'>"+
	"<input type='hidden' name='url' size='30' value='//www.rmastri.it/quiz-patente-b.php?E"+wp4url+"' style='width:100%'>"+
	"<input type='submit' name='submit' value='Crea un link più corto con TinyURL!' style='font-size:30px;height:100px'></form></div><br />"+

	"<input type='button' value='Chiudi questa finestra' onclick='self.close()' style='font-size:30px;height:100px' /></div><br/></body>"
	
		var dummy=window.open()
		dummy.document.write(dumtxt)
		dummy.document.close()
		
	//document.location="//www.rmastri.it/4/webpatente4/espurl.php?wp4url="+wp4url+"&burl="+burl
}
*/

// Nuova funzione esportazione
var winexp
function salva(wp4url){
	aggiornabanner()
	if (winexp==null){ 
		var pan1 = new Ext.Panel({	
			region: 'center',
			autoScroll: true,
			title: 'Esporta esame',
			html: '<div id="expesa"></div>',
		
		});
	
		winexp = new Ext.Window({
			title: ver.app+' - Esporta',
			closable:true,
			closeAction:'hide',
			minimizable:false,
			collapsible:true,
			resizable:false,
			width:winmanuW,
			height:winmanuH,
			border:false,
			plain:true,			
			items: [pan1],
			buttonAlign: 'right',
			buttons : [
			{text: 'Chiudi',handler: function(){expris.hide();},tooltipType: 'title', tooltip: 'Chiudi questa finestra'} 
			]
		});
	}
	
	finattiva('winexp');
	winexp.show();
	if (winexp.collapsed) expris.toggleCollapse()
	esporta(wp4url)	
}

function esporta(wp4rul){
	var burl=document.location.toString()

	if (offline==false) { //Online!
		var interr=burl.indexOf("?")
		if (interr!=-1)	burl=burl.substr(0,interr)
		var dumtxt="<div style='text-align:center;font-family:verdana,arial;font-size:40px;'>"+
		"<b>Salva il link o aggiungilo ai preferiti</b><br/><br/>"+
		"Link per aprire la scheda con questa versione di "+ver.app+":<br/>"+
		"<a href='"+burl+"?E"+wp4url+"'>"+burl+"?E"+wp4url+"</a><br /><br />"+
		"<div><form action='//tinyurl.com/create.php' method='post' target='_blank'>"+
		"<input type='hidden' name='url' size='30' value='"+burl+"?E"+wp4url+"' style='width:100%'>"+
		"<input type='submit' name='submit' value='Crea un link più corto con TinyURL!' style='font-size:30px;height:100px'></form></div>"+
		
		"<br/>Link per aprire la scheda con "+ver.app+" touch (per PC e tablet):<br/>"+
		"<a href='"+onlineadd+"?E"+wp4url+"'>"+onlineadd+"?E"+wp4url+"</a><br /><br />"+
		"<div><form action='//tinyurl.com/create.php' method='post' target='_blank'>"+
		"<input type='hidden' name='url' size='30' value='"+onlineadd+"?E"+wp4url+"' style='width:100%'>"+
		"<input type='submit' name='submit' value='Crea un link più corto con TinyURL!' style='font-size:30px;height:100px'></form></div>"
	}else{ //Offline
		var dumtxt="<div style='text-align:justify;font-family:verdana,arial;font-size:40px;'>"+
		"Tocca questo link per aprire l'ultima scheda di esame con la versione online di "+ver.app+" (tieni premuto per copiarlo nella clipboard):<br/><br/><div style='text-align:center'>"+
		"<a href='"+onlineadd+"mobi/?E"+wp4url+"'>"+onlineadd+"mobi/?E"+wp4url+"</a><br /><br />"+
		"<div><form action='//tinyurl.com/create.php' method='post' target='_blank'>"+
		"<input type='hidden' name='url' size='30' value='"+onlineadd+"mobi/?E"+wp4url+"' style='width:100%'>"+
		"<input type='submit' name='submit' value='Crea un link più corto con TinyURL!' style='font-size:30px;height:100px'></form></div></div>"	
	}
	getWin(winexp,'expesa').innerHTML=dumtxt;

}
function consolemsg(str){
	console.log(str)
}