// FILE COMUNE PER TUTTE LE VERSIONI (MOBI, DESKTOP, ANDRO)

function play_sound(u){
//alert(u)
	try{
		if (offtype=="andro"){
			interjs.playAudio(u)
		}else{
			audioele=document.getElementById("audioele")
			audioele.setAttribute('src',u)
			audioele.play()
		}
	}catch(err){
		alert("Si è verificato un errore imprevisto!")
	}
}

// niftyplayer Wrapper
function niftyplayer(name){
	this.loadAndPlay = function (url) {
		var mwin
		play_sound(url);
	};
	this.registerEvent = function (eventName, action) {
		var audioeve
		var audioele=document.getElementById("audioele")
		switch(eventName){
			case "onPlay":
				audioeve="loadstart"
			break	
			case "onSongOver":
				audioeve="ended"
				audioele.addEventListener("error", function(){eval(action);}, false);
			break	
		}
		
		audioele.addEventListener(audioeve, function(){eval(action)}, false);
		
	};	
	this.loaderrorshown=false
	this.loaderror=function(){
		alert(this.loaderrorshown)
		if (this.loaderrorshown==false){
			Ext.example.msg("File audio non trovato","Per eseguire i file audio occorre disporre di un collegamento Internet.");
			this.loaderrorshown=true
		}	
	}
	return this;
}	

/*

function html5_audio(){
	var a = document.createElement('audio');
	return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
 
var play_html5_audio = false;
if(html5_audio()) play_html5_audio = true;
 
function play_sound(url){
	if(play_html5_audio){
		alert("html5 "+url)
		var snd = new Audio(url);
		snd.load();
		snd.play();
	}else{
		alert("embed "+url)
		$("#sound").remove();
		var sound = $("<embed id='sound' type='audio/mpeg' />");
		sound.attr('src', url);
		sound.attr('loop', false);
		sound.attr('hidden', true);
		sound.attr('autostart', true);
		$('body').append(sound);
	}
}
 function old_play_sound(url){
 		//alert(url)
 		var audioele=document.getElementById("toplay")
		var tmp='<audio autoplay="autoplay" >'
		var mtype=(sext=="mp3")?"mpeg":sext;
 		tmp+='<source src="'+url+'" type="audio/'+mtype+'" />'
  		//tmp+='<source src="suoni/zuccone.wav" type="audio/wav" />'
  		tmp+='</audio>'
		audioele.innerHTML=tmp
}
function play_sound(url){
 		//alert(url)
 		var divele=document.getElementById("toplay")
		var tmp='<audio id="audioele">'
		var mtype=(sext=="mp3")?"mpeg":sext;
 		tmp+='<source src="'+url+'" type="audio/'+mtype+'" />'
  		tmp+='</audio>'
		divele.innerHTML=tmp
		document.getElementById("audioele").play()
}
*/