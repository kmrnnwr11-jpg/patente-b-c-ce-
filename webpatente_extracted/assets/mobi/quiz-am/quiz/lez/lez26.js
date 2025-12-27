function selcategoria(){
	var x, ret=""
	for (x=0;x<catfig.length;x++){
		ret+="<option value='"+x+"'"+((x==manuale.catfigatt)?" selected='selected'":"")+">"+catfig[x].def+"</option>"
	}
	return ret;
}
function ritornacategoria(cat){
		var x, ret="", figneg
	for (x=0;x<catfig[cat].fig.length;x++){
		if (catfig[cat].fig[x]>0){
			ret+="<div class='fig_contfig'><div class='fig_bordo' id='b"+catfig[cat].fig[x]+"'><img id='f"+catfig[cat].fig[x]+"' class='fig_figura' src='"+prefimg+catfig[cat].fig[x]+".gif' onclick='ingrandisci("+catfig[cat].fig[x]+")' title='Figura n. "+catfig[cat].fig[x]+". Fare click per visualizzarne un ingrandimento' /></div>Fig. "+catfig[cat].fig[x]+" </div>";
		}else{
			figneg=Math.abs(catfig[cat].fig[x])
			vercat=catfig[cercafigura(figneg)].def
			ret+="<div class='fig_contfig'><div class='fig_bordo_p'><img class='fig_figura_p' src='"+prefimg+figneg+".gif' onclick='ingrandisci("+figneg+")' title='La figura n. "+figneg+" appartiene alla categoria "+vercat+"' /></div>Fig. "+figneg+" </div>";
		}	
	}
	return ret
}

function mostracategoria(cat,fig){
	if (cat!=manuale.catfigatt){ // Non aggiornare se la categoria non cambia
		getWin(winmanu,"selcategoria").selectedIndex=cat;
		manuale.catfigatt=cat
		getWin(winmanu,"spaziolezioni").innerHTML=ritornalezioni(cat);	
		getWin(winmanu,"spaziofigure").innerHTML=ritornacategoria(cat);	
		getWin(winmanu,"pr_fig_intesta").innerHTML=catfig[cat].def
	}	
	if (fig!=null) { // Evidenzia la figura
		dum=getWin(winmanu,"f"+fig).style.border="1px solid #00cc00"
		dum=getWin(winmanu,"b"+fig).style.border="1px solid #00cc00"
		dum
		
		figtrov=fig
	}
}

function cercafigura(fig){
	var x,y
	for (x=0;x<catfig.length;x++){
		for (y=0;y<catfig[x].fig.length;y++){
			if (fig==catfig[x].fig[y]) return x
		}	
	}
	return -1
}

function mostracatfig(fig){
	if (figtrov!=null){ //Cancella la precedente selezione
		dum=getWin(winmanu,"f"+figtrov)
		if (dum!=null){
			dum.style.border="1px solid #dddddd"
			getWin(winmanu,"b"+figtrov).style.border="1px solid #fff"
		}	
		figtrov=null
	}
	if (fig!=""){
		fig=fig.replace(/^[0]+/g,"");
		var cat
		cat= cercafigura(parseInt(fig))
		//alert(cat)
		if (cat==-1){
			getWin(winmanu,"cercafigura").style.border="2px solid #ff0000"
			getWin(winmanu,"cercafigura").style.margin="0px"
		}else{
			getWin(winmanu,"cercafigura").style.border="2px solid #00cc00"
			getWin(winmanu,"cercafigura").style.margin="0px"
			mostracategoria(cat,fig)
		}
	}else{
		getWin(winmanu,"cercafigura").style.border="1px solid #7F9DB9"
		getWin(winmanu,"cercafigura").style.margin="1px"
	}		
}

function ritornalezioni(cat){
	var x, ret=""
	for (x=0;x<catfig[cat].lez.length;x++){
		ret+="<a href='javascript:nuovalez("+catfig[cat].lez[x]+")' class='esercitati'><b>Lezione "+catfig[cat].lez[x]+"</b></a>, "
	}
	return ret.substr(0,ret.length-2)
}
function vaicat(off){
	var selcat=getWin(winmanu,"selcategoria")
	var ind=selcat.selectedIndex+off
	if (ind<0) {
		mostracategoria(selcat.length-1)
	}else if(ind>selcat.length-1){
		mostracategoria(0)	
	}else{
		mostracategoria(ind)
	}
}

var figtrov
l=new tlez; with(l){
intro="<div id='pr_fig_intesta'>"+catfig[manuale.catfigatt].def+"</div><div class='fig_intesta'>Categoria: <select id='selcategoria' onchange='mostracategoria(this.value)'>"+selcategoria()+"</select><span id='manfigpan'><span id='avind'><a href='javascript:vaicat(-1)' title='Vai alla categorie di figure precedente'>« Indietro</a> - <a href='javascript:vaicat(1)' title='Vai alla categoria di figure seguente'>Avanti »</a></span> Cerca figura: <input id='cercafigura' type='text' maxlength='3' onkeyup='mostracatfig(this.value)' /></span></div><div id='pr_fig_esercitati' class='fig_intesta esercitati'>Lezioni e quiz su queste figure: <span id='spaziolezioni'>"+ritornalezioni(manuale.catfigatt)+"</span></div><div id='spaziofigure'>"+ritornacategoria(manuale.catfigatt)+"</div>"
nocache=true //Consente a questa pagina di essere dinamica
}
manuale.continua()