const mongoose = require('mongoose');

// Création du schema mongoose comme précisé dans la note de cadrage, id généré automatiquement par mongoDB
const sauceSchema = mongoose.Schema({

    userId:             { type: String,     required: true },
    name:               { type: String,     required: true },
    manufacturer:       { type: String,     required: true },
    description:        { type: String,     required: true },
    mainPepper:         { type: String,     required: true },
    imageUrl:           { type: String,     required: true },
    heat:               { type: Number,     required: true },
    likes:              { type: Number,     required: false,    default: 0 },
    dislikes:           { type: Number,     required: false,    default: 0 },

    usersLiked:         { type: Array,   required: false },
    usersDisliked:      { type: Array,   required: false },
});

// Exporte du shéma de données, pour pouvoir utiliser ce modèle pour intéragir avec l'application
module.exports = mongoose.model('Sauce', sauceSchema);
