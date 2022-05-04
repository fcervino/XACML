var express = require('express');
var router = express.Router();
var fs = require('fs');
var XMLWriter = require('xml-writer');
var path = require('path');
//const {exec} = require('child_process');
const {execSync} = require('child_process');

var organigramma = '';

const nimpiegati = 8;

var nimp; //soggetto richiedente
var risorsa; //indice risorsa

/*var organigramma = JSON.parse('{"impiegati":['+
'{"id":"001","nome":"Alice","password":"password1","ruolo":"Dipendente","gruppo":"IT","stipendio":"20000"},'+
'{"id":"002","nome":"Bob","password":"password2","ruolo":"Manager","gruppo":"IT","stipendio":"30000"},'+
'{"id":"003","nome":"Charlie","password":"password3","ruolo":"Direttore","gruppo":"IT","stipendio":"40000"},'+
'{"id":"004","nome":"David","password":"password4","ruolo":"Dipendente","gruppo":"HR","stipendio":"20000"},'+
'{"id":"005","nome":"Elly","password":"password5","ruolo":"Manager","gruppo":"HR","stipendio":"31000"},'+
'{"id":"006","nome":"Frank","password":"password6","ruolo":"Direttore","gruppo":"HR","stipendio":"37000"},'+
'{"id":"007","nome":"George","password":"password7","ruolo":"Dipendente","gruppo":"IT","stipendio":"20500"},'+
'{"id":"008","nome":"Henry","password":"password8","ruolo":"Dipendente","gruppo":"HR","stipendio":"18000"}'+
']}');*/

var presente = '';

router.post('/', function(req, res, next) {

	//Lettura file organigramma
	try {
		organigramma = JSON.parse(fs.readFileSync(__dirname+'/../private/organigramma.json', 'utf8'));
		console.log('Lettura file ok');
	} catch (err) {
		console.error(err);
		res.send('Errore in apertura file');
	}

	//recupero parametri richiesta
	const soggetto = req.body.nome;
	const password = req.body.password;
	const azione = req.body.azione;
	const nome_risorsa = req.body.nome_risorsa;
	const nuovo_valore = req.body.nuovo_valore;

	const ipaddr = req.ip.substr(7)

	var today = new Date();
	var time = (today.getHours()+2)%24 + ":" + today.getMinutes() + ":" + today.getSeconds();

	//controllo presenza soggetto
	for(var i=0; i<nimpiegati; i++){
		if(soggetto.localeCompare(organigramma.impiegati[i].nome)==0){
			nimp = i;
			presente = 'UtenteOk';
		}
		//se il nome non è presente nell'organigramma vengono asseganti valori nulli
		if(presente.localeCompare('UtenteOk')!=0)
			nimp = nimpiegati;
	}

	//recupero parametri risorsa
	var id_risorsa = '';
	var ruolo_risorsa = '';
	var gruppo_risorsa = '';
	var valore_risorsa = 0;
	for(var i=0; i<nimpiegati; i++){
		if(nome_risorsa.localeCompare(organigramma.impiegati[i].nome)==0){
			risorsa = i;
			id_risorsa = organigramma.impiegati[i].id;
			ruolo_risorsa = organigramma.impiegati[i].ruolo;
			gruppo_risorsa = organigramma.impiegati[i].gruppo;
			valore_risorsa = organigramma.impiegati[i].stipendio;
		}
	}

	//Scrittura file richiesta
	var xw = new XMLWriter('	');
	xw.formatting = 'indented';
	//xw.indentChar = '	';
	xw.indentation = 1;
	xw.startDocument();
	xw.startElement('Request');
	xw.writeAttribute('ReturnPolicyIdList', 'false');
	xw.writeAttribute('CombinedDecision', 'false');
	xw.writeAttribute('xmlns', 'urn:oasis:names:tc:xacml:3.0:core:schema:wd-17');
	xw.writeAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
		//attributi del soggetto
		xw.startElement('Attributes');
		xw.writeAttribute('Category', 'urn:oasis:names:tc:xacml:1.0:subject-category:access-subject');
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'isOk');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(presente);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'pass_soggetto');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(password);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'ip_addr');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(/*ipaddr*/'93.144.0.0'/*da togliere!!!!*/);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'soggetto');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(soggetto);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'id_soggetto');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(organigramma.impiegati[nimp].id);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'ruolo_soggetto');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(organigramma.impiegati[nimp].ruolo);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'gruppo_soggetto');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(organigramma.impiegati[nimp].gruppo);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'nuovo_valore');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#integer');
					xw.text(nuovo_valore);
				xw.endElement();
			xw.endElement();
		xw.endElement();
		//attributi della risorsa
		xw.startElement('Attributes');
		xw.writeAttribute('Category', 'urn:oasis:names:tc:xacml:3.0:attribute-category:resource');
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'pass_user');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(organigramma.impiegati[nimp].password);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'nome_risorsa');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(nome_risorsa);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'id_risorsa');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(id_risorsa);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'ruolo_risorsa');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(ruolo_risorsa);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'gruppo_risorsa');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(gruppo_risorsa);
				xw.endElement();
			xw.endElement();
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'valore_risorsa');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#integer');
					xw.text(valore_risorsa);
				xw.endElement();
			xw.endElement();
		xw.endElement();
		//attributi dell'ambiente
		xw.startElement('Attributes');
		xw.writeAttribute('Category', 'urn:oasis:names:tc:xacml:3.0:attribute-category:environment');
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'orario');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(/*time*/'12:00:00'/*DA TOGLIERE!!!*/);
				xw.endElement();
			xw.endElement();
		xw.endElement();
		//azione richiesta
		xw.startElement('Attributes');
		xw.writeAttribute('Category', 'urn:oasis:names:tc:xacml:3.0:attribute-category:action');
			xw.startElement('Attribute');
			xw.writeAttribute('IncludeInResult', 'false');
			xw.writeAttribute('AttributeId', 'azione');
				xw.startElement('AttributeValue');
				xw.writeAttribute('DataType', 'http://www.w3.org/2001/XMLSchema#string');
					xw.text(azione);
				xw.endElement();
		xw.endElement();
	xw.endElement();
	xw.endDocument();

	console.log('Richiesta.xml:\n' + xw.toString());

	//scrittura Request.xml
	try {
		fs.writeFileSync(__dirname+'/../private/Request.xml', xw.toString());
		console.log('Scrittura richiesta ok');
	} catch (err) {
		console.error(err);
		res.send("Errore nella gestione della richiesta. Prego riprovare");
	}

	//verifica richiesta
	var esito = false;
	/*execSync("cd private;./authzforce-ce-core-pdp-cli-20.1.0.jar pdp.xml Request.xml 2>/dev/null", (error, stdout, stderr) => {
		/*if (error) {
			res.send('Errore nella valutazione della richiesta');
		}
		if (stderr) {
			res.send('Errore nella valutazione della richiesta');
		}*
		console.log('Decisione:\n' + stdout);
		if(stdout.includes('Permit')){
			esito = true;
		}
	});*/
	esito = execSync("cd private;./authzforce-ce-core-pdp-cli-20.1.0.jar pdp.xml Request.xml 2>/dev/null").includes('Permit');

	console.log('Decisione presa');

	//reinizializzazione variabili
	//presente = '';
	//serve?????

	//aggiornamento file organigramma
	if(azione.localeCompare('Write')==0 && esito == true){
		organigramma.impiegati[risorsa].stipendio = nuovo_valore;
		console.log(nuovo_valore+' in '+ JSON.stringify(organigramma.impiegati[nimp]));
		console.log('Aggiornamento:\n'+JSON.stringify(organigramma));
		try {
			fs.writeFileSync(__dirname+'/../private/organigramma.json', JSON.stringify(organigramma));
			console.log('Scrittura file ok');
		} catch (err) {
			console.error(err);
			res.send("Errore nell'aggiornamento del valore. Prego riprovare");
		}
	}

	if(esito)
		//creazione e invio risorsa
		try {
			fs.writeFileSync(__dirname+'/../private/risorsa.txt', 'Nome: '+nome_risorsa+'\nId: '+id_risorsa+'\nRuolo: '+ruolo_risorsa+'\nGruppo: '+gruppo_risorsa+'\nStipendio: '+organigramma.impiegati[risorsa].stipendio);
			console.log('Creazione risorsa ok');
		} catch (err) {
			console.error(err);
			res.send("Errore nella creazione della risorsa da restituire. Prego riprovare");
		}
		res.sendFile(path.resolve(__dirname+'/../private/risorsa.txt'));

	if(!esito)
		res.send('Accesso negato - operazione non effettuabile con gli attributi forniti');

});

module.exports = router;
