ver.verquiz="CDE-01"

var finecap =[204,264,277,306,332,366,392];
var fineargo=[204,264,277,306,332,366,392];

var argomenti = [
"Nozioni sulla costruzione ed il funzionamento dei motori a combustione interna, dei liquidi e del sistemi di alimentazione del carburante, elettrico, di accensione e di trasmissione",
"Lubrificazione e protezione dal gelo",
"Nozioni su costruzione, montaggio e corretto impiego e manutenzione degli pneumatici",
"Freno e acceleratore: nozioni sui tipi esistenti, funzionamento, componenti principali, collegamenti, impiego e manutenzione ordinaria, compreso l'ABS",
"Metodi per individuare le cause dei guasti. Organi di direzione. Sospensioni e ammortizzatori",
"Manutenzione dei veicoli a scopo preventivo e effettuazione delle opportune riparazioni ordinarie"];

var capmin= [];
var cappeso =[4,1,3,2,2,2];
var titolilezioni=[];
//gruppi nascosti // bloccacanc=true è impostato in postscript() all'interno del file index
var quiznasc="|372|";
//## rispnasc
var rispnascquiz=""
//var rispnascquiz="|730|800|804|805|808|871|"; //gruppi con risposte nascoste
var rispnasc =[];
//rispnasc[730]="|0|";
//rispnasc[871]="|0|2|"; 
//## 
var diraut="<div class='diraut'><b>Manuale di teoria per le patenti A e B - Versione 4.2 © 2002-2015 Roberto Mastri.</b> Testi e immagini, anche se messi a disposizione gratuitamente, sono soggetti alla normativa vigente sul diritto d'autore. Ne sono ammessi la stampa e la riproduzione solo per l'uso personale. Ogni altra forma di riproduzione, anche parziale, o di distribuzione (attraverso pubblicazioni a stampa, CD-ROM, siti internet, ecc.), non debitamente autorizzata, sarà perseguita a termine di legge. <b>Non si assumono responsabilità; per eventuali inesattezze.</b></div>";
var testipla="<div class='suggcopy'>© 2011-2015 - www.rmastri.it</div>"
var aiuto="<div class='altroaiuto'><b>Serve altro aiuto?</b> Scrivi ai nostri esperti per chiarirti i dubbi e per avere ulteriori informazioni. Trovi il modulo di richiesta (gratuita) in <a href='javascript:openbrowser(\"http://www.rmastri.it/chiediagliesperti.html\")'><b>questa pagina</b></a>."
var vuoistampare=""; //"<br/><b>Vuoi stampare questo manuale?</b> Scarica subito la <a href='javascript:openbrowser(\"http://www.rmastri.it/download.php?view.20\")'><b>versione PDF delle lezioni</b></a> e <a href='javascript:openbrowser(\"http://www.rmastri.it/download.php?view.21\")'><b>delle figure</b></a>."
var altroaiuto=aiuto+vuoistampare+"</div>"
var catfig=[]
