var sto
var mod = 'test';
try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    sto= true;
} catch(e) {
    sto=false;
}

if (!sto) {
	if (offtype!="xul"){
		var Cookies = {};
		Cookies.set = function(name, value, comm){
		//alert(name+" > "+value)
		     var argv = arguments;
		     var argc = arguments.length;
		     var expires = (argc > 3) ? argv[3] : null;
		     var path = (argc > 4) ? argv[4] : '/';
		     var domain = (argc > 5) ? argv[5] : null;
		     var secure = (argc > 6) ? argv[6] : false;
		     var datexp=new Date(2100,12,1)
		     document.cookie = ((comm==null)?ver.abb:"wp")+"_"+name + "=" + escape (value) +
		       ((expires == null) ? ("; expires=" + datexp.toUTCString()) : ("; expires=" + expires.toUTCString())) +
		       ((path == null) ? "" : ("; path=" + path)) +
		       ((domain == null) ? "" : ("; domain=" + domain)) +
		       ((secure == true) ? "; secure" : "");
		};
		
		Cookies.get = function(name,comm){
			var arg = ((comm==null)?ver.abb:"wp")+"_"+name + "=";
			var alen = arg.length;
			var clen = document.cookie.length;
			var i = 0;
			var j = 0;
			while(i < clen){
				j = i + alen;
				if (document.cookie.substring(i, j) == arg)
					return Cookies.getCookieVal(j);
				i = document.cookie.indexOf(" ", i) + 1;
				if(i == 0)
					break;
			}
			return null;
		};
		
		Cookies.clear = function(name) {
		  if(Cookies.get(name)){
		    document.cookie = ver.abb+"_"+name + "=" +
		    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		  }
		};
		
		Cookies.getCookieVal = function(offset){
		   var endstr = document.cookie.indexOf(";", offset);
		   if(endstr == -1){
		       endstr = document.cookie.length;
		   }
		   return unescape(document.cookie.substring(offset, endstr));
		};
  	}else{ // XUL
  		
  		var Cookies ={
 			set: function(name, value, comm){
			
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
				var branch = prefs.getBranch("extensions."+((comm==null)?ver.abb:"wp")+".");
			     branch.setCharPref(name, value);
			},
			
			get: function(name,comm){
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
				var branch = prefs.getBranch("extensions."+((comm==null)?ver.abb:"wp")+".");
				try{
					var value = branch.getCharPref(name); 
					return value;
				}catch(e){
					return null;
				}
			}
		}
  	}

}else{

	var Cookies = {};
	Cookies.set = function(name, value,comm){
		name= ((comm==null)?ver.abb:"wp")+"_"+name
		try{
			localStorage.setItem(name, value);
		}catch(err){
			alert("Si è verificato un errore "+err);
		}
	};
	
	Cookies.get = function(name,comm){
		name= ((comm==null)?ver.abb:"wp")+"_"+name
		try{
			return localStorage.getItem(name);
		}catch(err){
			alert("Si è verificato un errore "+err);
		}	
			
			
	};
	
	Cookies.clear = function(name) {
		localStorage.removeItem(name);
	};
	
	Cookies.getCookieVal = function(offset){	
		try{
		
			return localStorage.key(offset);
		}catch(err){
			alert("Si è verificato un errore "+err);
		}	
		
	}
	
}	