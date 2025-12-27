ver.verquiz="AM-03"

var finecap=[0,42,98,144,160,190,207,240,267,298,334]
var fineargo = [0,42,54,74,98,110,121,127,144,160,168,179,190,195,207,216,226,240,246,255,267,298,306,318,328,334];
var argomenti = ["Segnali di pericolo","Segnali di precedenza","Segnali di divieto","Segnali di obbligo","Segnali di indicazione. Segnali complementari e di cantiere","Pannelli integrativi dei segnali","Segnali luminosi (semafori)","Segnaletica orizzontale ","Ordine di precedenza (incroci)","Cambio di corsia, cambio di direzione (svolte) ","Velocità. Distanza di sicurezza","Sorpasso","Definizioni stradali","Fermata, sosta e partenza","Cause di incidenti stradali","Eventi atmosferici (pioggia, neve, nebbia, vento)","Uso corretto della strada. Assicurazione","Casco protettivo","Dispositivi di equipaggiamento (luci, specchietti, clacson)","Elementi costitutivi del veicolo (pneumatici, freni)","Documenti per la guida. Comportamenti alla guida","Stato fisico del conducente","Doveri del conducente","Comportamento in caso d'incidente. Responsabilità  civile e penale","Inquinamento"];
var capmin= [1,2,2,2,3,3,3,3,4,5,5,5,6,6,7,7,7,8,8,8,9,10,10,10,10];
var cappeso=[2,2,2,2,2,2,2,2,2,2];
var titolilezioni=["Introduzione","1. Definizioni stradali","2. Segnali di pericolo","3. Segnali di precedenza","4. Segnali di divieto","5. Segnali di obbligo","6. Segnali di indicazione","7. Segnali complementari e di cantiere","8. Pannelli integrativi dei segnali","9. Segnali luminosi (semafori)","10. Segnaletica orizzontale","11. Velocità","12. Distanza di sicurezza","13. Cambio di direzione (svolte), cambio di corsia","14. Ordine di precedenza (incroci)","15. Sorpasso","16. Fermata e sosta","17. Elementi del ciclomotore e loro uso: luci, clacson, pneumatici e freni","18. Casco protettivo","19. Cause di incidenti stradali. Comportamento in caso di pioggia, neve, nebbia o vento","20. Doveri del conducente ","21. Guida di un ciclomotore","22. Comportamento rispetto agli altri utenti della strada","23. Comportamento in caso d'incidente. Assicurazione","24. Stato fisico del conducente","25. Riduzione dei consumi e dell'inquinamento","Rappresentazioni grafiche usate nei quiz"];
var quiznasc = "|298|316|" // = "|269|270|"
//## rispnasc
var rispnascquiz="|266|"; //gruppi con risposte nascoste
var rispnasc =[];
rispnasc[266]="|5|";
//##

var diraut="<div class='diraut'><b>Manuale di teoria per la Patente AM - Versione 1.3 © 2011-2017 Roberto Mastri.</b> Testi e immagini, anche se messi a disposizione gratuitamente, sono soggetti alla normativa vigente sul diritto d'autore. Ne sono ammessi la stampa e la riproduzione solo per l'uso personale. Ogni altra forma di riproduzione, anche parziale, o di distribuzione (attraverso pubblicazioni a stampa, CD-ROM, siti internet, ecc.), non debitamente autorizzata, sarà perseguita a termine di legge. <b>Non si assumono responsabilità  per eventuali inesattezze.</b></div>";
var testipla="<div class='suggcopy'>© 2011-2017 - www.rmastri.it</div>"
var aiuto="<div class='altroaiuto'><b>Serve altro aiuto?</b> Scrivi ai nostri esperti per chiarirti i dubbi e per avere ulteriori informazioni. Trovi il modulo di richiesta (gratuita) in <a href='javascript:openbrowser(\"http://www.rmastri.it/chiediagliesperti.html\")'><b>questa pagina</b></a>."
var vuoistampare=""; //"<br/><b>Vuoi stampare questo manuale?</b> Scarica subito la <a href='javascript:openbrowser(\"http://www.rmastri.it/download.php?view.20\")'><b>versione PDF delle lezioni</b></a> e <a href='javascript:openbrowser(\"http://www.rmastri.it/download.php?view.21\")'><b>delle figure</b></a>."
var altroaiuto=aiuto+vuoistampare+"</div>"

var catfig=[{def:'Segnali di Pericolo', lez:[2], fig:[01,02,03,04,05,06,07,08,09,10,11,13,14,15,16,17,18,19,20,21,23,24,25,28,31,33,34,37,-275]},
{def:'Segnali di Precedenza', lez:[3], fig:[40,41,43,44,45,46,47,49,50,52,53]},
{def:'Segnali di Divieto', lez:[4], fig:[54,55,56,58,59,62,63,64,66,80,81,82,84,85,86,90,91,92,148]},
{def:'Segnali di Obbligo', lez:[5], fig:[93,94,95,96,97,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,114,115,116,119]},
{def:'Pannelli Integrativi', lez:[8], fig:[121,122,123,124,125,128,129,130,132,135,139,-148]},
{def:'Segnali Luminosi', lez:[9], fig:[154,155,162]},
{def:'Segnali di Indicazione', lez:[6], fig:[-86,152,153,186,187,218,228,236,245]},
{def:'Segnali Complementari e di Cantiere', lez:[7], fig:[275,276,279,285,293]},
{def:'Segnali Orizzontali', lez:[10], fig:[501,502,509,517,520,531,546,547,550,563,565,574,670]},
{def:'Incroci', lez:[14], fig:[603,606,608,613,614,616,631,632,633,636,637,642,644,646,647,650]}]