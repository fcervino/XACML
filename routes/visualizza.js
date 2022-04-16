var express = require('express');
var router = express.Router();

const nimpiegati = 8;

var organigramma = JSON.parse('{"impiegati":['+
'{"id":"001","nome":"Alice","password":"password1","ruolo":"Dipendente","gruppo":"IT","stipendio":"20000"},'+
'{"id":"002","nome":"Bob","password":"password2","ruolo":"Manager","gruppo":"IT","stipendio":"30000"},'+
'{"id":"003","nome":"Charlie","password":"password3","ruolo":"Direttore","gruppo":"IT","stipendio":"40000"},'+
'{"id":"004","nome":"David","password":"password4","ruolo":"Dipendente","gruppo":"HR","stipendio":"20000"},'+
'{"id":"005","nome":"Elly","password":"password5","ruolo":"Manager","gruppo":"HR","stipendio":"31000"},'+
'{"id":"006","nome":"Frank","password":"password6","ruolo":"Direttore","gruppo":"HR","stipendio":"37000"},'+
'{"id":"007","nome":"George","password":"password7","ruolo":"Dipendente","gruppo":"IT","stipendio":"20500"},'+
'{"id":"008","nome":"Henry","password":"password8","ruolo":"Dipendente","gruppo":"HR","stipendio":"18000"}'+
']}');

var presente = '';

router.post('/', function(req, res, next) {

	//recupero parametri richiesta
	const soggetto = req.body.nome;
	const password = req.body.password;
	const azione = req.body.azione;
	const nome_risorsa = req.body.nome_risorsa;
	const nuovo_valore = req.body.nuovo_valore;

	var ipaddr = req.ip.substr(7)

	var today = new Date();
	var time = today.getHours()+2 + ":" + today.getMinutes() + ":" + today.getSeconds();

	//controllo presenza soggetto
	for(var i=0; i<nimpiegati; i++){
		if(soggetto.localeCompare(organigramma.impiegati[i].nome)==0){
			presente = 'UtenteOk';
		}
	}

	//Elaborazione file richiesta




	res.send(ipaddr + ' ' + time + ' ' + presente);

	//reinizializzazione variabili
	presente = '';

	//res.sendFile(__dirname + "/index.html");
});

module.exports = router;
