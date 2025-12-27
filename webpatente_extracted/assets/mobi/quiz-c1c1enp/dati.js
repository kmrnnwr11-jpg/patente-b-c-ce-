ver.verquiz="CDE-01"

var finecap =[121,135,139,166,172,194,204];
var fineargo=[121,135,139,166,172,194,204];

var argomenti = [
"Comportamento in caso di incidente; ingombro della carreggiata; uso del segnale triangolare mobile di pericolo",
"Precauzioni da adottare in caso di rimozione e sostituzione delle ruote",
"Disposizioni che regolano dimensione e massa dei veicoli; disposizioni che regolano i dispositivi di limitazione della velocità",
"Limitazione del campo visivo legata alle caratteristiche del veicolo",
"Fattori di sicurezza relativi al caricamento dei veicoli e alle persone trasportate",
"Sistemi di aggancio alla motrice di rimorchi e semirimorchi e relativi sistemi di frenatura"];

var capmin= [];
var cappeso=[1,0,2,0,0,1];
var titolilezioni=[];
//gruppi nascosti // bloccacanc=true è impostato in postscript() all'interno del file index
var quiznasc="|138|139|142|145|172|180|181|182|183|184|185|186|187|188|189|190|191|";
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
