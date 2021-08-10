const jwt = require('jsonwebtoken');//Permet d'attribuer un token à un utilisateur au moment ou il se connecte

// Middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.
// On vérifie le TOKEN de l'utilisateur, s'il correspond à l'id de l'utilisateur dans la requête, il sera autorisé à changer les données correspondantes.


// authentification
module.exports = (req, res, next) => {
    try {
        // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split)
        const token = req.headers.authorization.split(' ')[1];
        // On vérifie le token décodé avec la clé secrète initiéé avec la création du token encodé initialement (Cf Controller user), les clés doivent correspondre
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // on vérifie (méthode verify de jsonwebtoken) que le token, correspond au userID
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID'; // Le token ne correspond pas au userID
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
