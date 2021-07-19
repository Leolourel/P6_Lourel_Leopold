const User = require('../models/User');
const bcrypt = require('bcrypt'); // hasher le mot de passe
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  //on hashe le passeword avec un salt de 10
        .then(hash => {
            const user = new User({
                email: req.body.email,  //email encodé sauvegardé
                password: hash  // on assigne le hash obtenu comme valeur de la propriété password de l'objet user
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    console.log(error);
                    res.status(400).json({ error })
                });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error })
        });
};

//connexion d'un utilisateur
// exports.login = (req, res, next) => {
//     User.findOne({ email: req.body.email })  // on recherche l'équivalent du mail encondé
//         .then(user => {
//             if (!user) {
//                 return res.status(401).json({ error: 'Utilisateur non trouvé !' });
//             }
//             bcrypt.compare(req.body.password, user.password) //si email ok on compare le mot de passe avec bcryot
//                 .then(valid => {
//                     if (!valid) {
//                         return res.status(401).json({ error: 'Mot de passe incorrect !' });
//                     }
//                     res.status(200).json({
//                         userId: user._id,  // on renvoi le user._id (genere par mongoDB)
//                         token: jwt.sign(   // on renvoi un token d'authentification
//                             { userId: user._id },
//                             'RANDOM_TOKEN_SECRET',
//                             { expiresIn: '24h'}  //date d'expiration du token
//                         )
//                     });
//                 })
//                 .catch(error => res.status(500).json({ error }));
//         })
//         .catch(error => res.status(500).json({ error }));
// };
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
