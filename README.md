# Implementazione di un sistema di controllo degli accessi basato su attributi (ABAC) con XACML
Progetto per il corso di Sicurezza delle Architetture Orientate ai Servizi

# Introduzione
## Problema e soluzione proposta

Il servizio in questione è la simulazione di un portale aziendale per la gestione degli stipendi dei dipendenti

Si vuole fare in modo che solo gli stessi dipendenti possano accedervi rispettando una determinata politica di accesso

La soluzione è stata realizzata utilizzando NodeJs per la creazione del servizio REST e XACML per garantire il rispetto della politica di accesso al servizio

## La politica di accesso

- Ogni utente può accedere solamente con nome e password corretti da un determinato indirizzo IP (es. quello della rete aziendale) e in un orario compreso tra le 9:00 e le 19:30

- Tutti i dipendenti possono leggere i propri dati

- I manager possono leggere anche i dati dei dipendenti del proprio gruppo di appartenenza

- I direttori possono leggere anche i dati di dipendenti e manager a prescindere dal gruppo di appartenenza

- I direttori possono aumentare gli stipendi di un altro dipendente o manager

# Funzionamento

Schema del flusso delle informazioni:

![18D47192-9E09-4740-BD12-1BF6F5C3AF3A](https://user-images.githubusercontent.com/64200619/170750828-8dc12f64-8bad-45cb-850e-696975cc6555.jpeg)

Approfondimento dei flussi principali:
- 2. L’utente esegue una POST con i propri attributi: nome, hash della password, azione desiderata, nome della risorsa ed eventuale nuovo valore (in caso di modifica)
- 3. Questi attributi, a cui viene aggiunto l’indirizzo IP dell’utente vengono passati al context handler e successivamente (4) al PIP
- 5. Il PIP riceve:
 a. L’hash della password del soggetto memorizzato nel server 
 b. L’orario della richiesta
 c. Gruppo e ruolo della risorsa
- 6. Tutti gli attributi vengono inviati al context handler che compila il file Request.xml e lo invia (8) al PDP
- 9. Il PDP esamina la richiesta sulla base della politica (acquisita nel flusso 1) e concede o nega il permesso di accedere alla risorsa
- 10. In caso di risposta affermativa il context handler ritorna la risorsa (acquisita nel flusso 7), in caso contrario ritorna un messaggio di errore

# Valutazione della richiesta

La richiesta viene formalizzata in un file (Request.xml) in modo che possa essere valutata dal PDP sulla base di ciò che prevede la politica di riferimento, formalizzata anch’essa nel file Policy.xml
Il componente che si occupa di questo è un eseguibile in java che viene eseguito dal context handler utilizzando come argomenti i due file xml di cui sopra
La risposta è anch’essa in xml e può essere:
- Deny, nel caso in cui è stata violata almeno una regola contenuta nella politica
- Permit, se sono state rispettate tutte le regole della politica
- Not Applicable, se la politica non può essere applicata alla richiesta in esame (ovvero nel caso in cui il Nome del soggetto non risulta tra quelli dei dipendenti) - in questo caso la richiesta viene comunque rifiutata
