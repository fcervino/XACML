var express = require('express');
var router = express.Router();
var fs = require('fs');
var XMLWriter = require('xml-writer');

var organigramma = '';

const nimpiegati = 8;

var nimp; //soggetto richiedente

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

	var ipaddr = req.ip.substr(7)

	var today = new Date();
	var time = (today.getHours()+2)%24 + ":" + today.getMinutes() + ":" + today.getSeconds();

	//controllo presenza soggetto
	for(var i=0; i<nimpiegati; i++){
		if(soggetto.localeCompare(organigramma.impiegati[i].nome)==0){
			nimp = i;
			presente = 'UtenteOk';
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
					xw.text(organigramma.impiegati[nimp].password);
				xw.endElement();
			xw.endElement();
		xw.endElement();
	xw.endElement();
	xw.endDocument();

	console.log('Richiesta.xml:\n' + xw.toString());

	//test debug
	res.send(ipaddr + ' ' + time + ' ' + presente + ' ' + organigramma.impiegati[1].nome);

	//reinizializzazione variabili
	presente = '';
	//serve?????

	//aggiornamento file organigramma
	/*try {
		fs.writeFileSync(__dirname+'/../private/organigramma.json', JSON.stringify(organigramma));
		console.log('Scrittura file ok');
	} catch (err) {
		console.error(err);
		res.send("Errore nell'aggiornamento del valore. Prego riprovare");
	}*/


	//invio risorsa
	//res.sendFile(__dirname + "/index.html");
});

module.exports = router;
