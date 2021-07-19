const jwt = require('jsonwebtoken');

// authentification
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  //on sépare le bear et on garde que le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');   // on vérifie (méthode verify de jsonwebtoken) que le token, correspond au secret (token) que l'on a dans process.env
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
