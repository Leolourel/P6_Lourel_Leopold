//Ecoute des requetes htpp et reponse
const http = require('http');
//Import de app.js
const app = require('./app');


//renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//Ecoute sur le port 3000 si aucun port n'est declaré
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Appels serveur : requetes et reponses
const server = http.createServer(app);

//Gestion des evenements serveur
server.on('error', errorHandler);
server.on('listening', () => {  //Ecouteur d'évènement qui enregistre le port sur lequel le serveur s'éxecute
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

//Le serveur écoute le port définit plus haut
server.listen(port);
