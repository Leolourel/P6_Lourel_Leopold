//Récupération du modèle créé grace à la fonction schéma de mongoose

//Récupération du modèle sauce
const Sauce = require('../models/Sauce');
//permet d'acceder au file-system -> permet de gérer les téléchargements et modifications d'images
const fs = require('fs');

//acceder à toutes les sauces
exports.getAllSauce = (req, res, next) => {
    //On utilise la méthode find pour obtenir l'array de toutes les sauces dans la base de données
    Sauce.find()
        //Si ok on retourne un tableau de toutes les données, sinon on retourne un message d'erreur
        .then((sauces) => {res.status(200).json(sauces);})
        .catch((error) => {res.status(400).json({error});
        });
};

//créer une sauce
exports.createOneSauce = (req, res, next) => {
    //Stock les données recus par le front et transforme en objet js
    const sauceObject = JSON.parse(req.body.sauce);
    //Suppréssion de l'id généré automatiquement avec MongoDB
    delete sauceObject._id;
    //Création d'une instance du modèle sauce
    const sauce = new Sauce({
       ...sauceObject,
        //Modification de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //On enregistre la sauce dans la base de données
    sauce.save()
        //Envoi d'une réponse au front avec un statut 201 et d'une erreur en cas de problème
         .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
         .catch(error => res.status(400).json({ error }));
};

//acceder à une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => { res.status(200).json(sauce);})
        .catch((error) => {res.status(404).json({error});
        });
};

//modifier une sauce
exports.modifyOneSauce = (req, res, _) => {
    //On récupére la sauce à modifier
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    //Mise à jour des modification de la sauce
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        //Envoi d'une réponse au front avec un statut 200 et d'une erreur en cas de problème
        .then(() => res.status(200).json({ message: 'sauce modifiée.' }))
        .catch(error => res.status(400).json({error}));
};

//supprimer une sauce
exports.deleteOneSauce = (req, res, next) => {
    //On récupere la sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //On supprime la sauce et l'image de la base de données
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    //Envoi d'une réponse au front avec un statut 200 et d'une erreur en cas de problème
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.rateOneSauce = (req, res, next) => {
    if (req.body.like === 1) { // si l'utilisateur aime la sauce //
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } }) // on ajoute 1 like et on le push l'array usersLiked //
            .then((sauce) => res.status(200).json({ message: 'Un like de plus !' }))
            .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) { // sinon si il aime pas la sauce //
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) // on ajoute 1 dislike et on le push l'array usersDisliked //
            .then((sauce) => res.status(200).json({ message: 'Un dislike de plus !' }))
            .catch(error => res.status(400).json({ error }));
    } else { // si l'utilisateur enleve son vote
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) { // si l'array userLiked contient le id de like //
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) // $pull : ça vide l'array userLiked et ça enleve un like sinon le meme utilisateur pourrai ajouter plusieurs like//
                        .then((sauce) => { res.status(200).json({ message: 'Un like de moins !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) { //// si l'array userDisliked contient le id de like //
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })// $pull : ça vide l'array userDisliked et ça enleve un like sinon le meme utilisateur pourrai ajouter plusieurs like//
                        .then((sauce) => { res.status(200).json({ message: 'Un dislike de moins !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
};
