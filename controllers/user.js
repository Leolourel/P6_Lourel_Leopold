const User = require('../models/User'); // Model user créer avec le schema mongoose
const bcrypt = require('bcrypt'); // hasher le mot de passe
const jwt = require('jsonwebtoken'); //Permet d'attribuer un token à un utilisateur au moment ou il se connecte

//Hashage de l'adresse mail qui va servir au route signup et login
function hashEmail(sentence) {
    if (typeof sentence === "string") {
        let headMail = sentence.slice(0,1);
        let bodyMail = sentence.slice(1, sentence.length-4);
        let bottomMail = sentence.slice(sentence.length-4, sentence.length);
        let final = [];
        var masked = bodyMail.split('');
        var maskedMail = [];
        for(let i in masked) {
            masked[i] = '*';
            maskedMail += masked[i];
        }
        final += headMail + maskedMail + bottomMail
        return final;
    }
    console.log(sentence + " is not a mail");
    return false
}


//Sauvegarde un nouvel utilisateur et crypte son mot de passe avec bcrypt
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  //on hash le passeword avec un salt de 10 (nombre de fois ou le mdp sera hasher)
        .then(hash => { //On recupére le mdp hasher qui va etre enregistrer en tant que nouvel utilisateur dans MongoDB
            const user = new User({ //Création du nouvel utilisateur avec le model mongoose
                email: hashEmail(req.body.email),  //email encodé sauvegardé
                password: hash  // on assigne le hash obtenu comme valeur de la propriété password de l'objet user
            });
            user.save() //On enregistre l'user dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    console.log(error);
                    res.status(400).json({ error })//Erreur possible, que un utilisateur est déja la méme adresse mail
                });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error })
        });
};

// Le Middleware pour la connexion d'un utilisateur vérifie si l'utilisateur existe dans la base MongoDB lors du login
//si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur
exports.login = (req, res, next) => {
    // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
    User.findOne({ email: hashEmail(req.body.email) })
        .then(user => {
            if (!user) {
                //Si l'adresse mail ne correspont pas on renvoi un erreur 401
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) { //Si le mdp ne correspond pas on renvoi une erreur 401
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', //Clé d'encodage du token
                            { expiresIn: '24h' } //Le token expire au bout de 24h, une nouvelle connexion sera demandée
                        ) // On encode le userID pour la création de nouveaux objets, et cela permet d'appliquer le bon userID
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
