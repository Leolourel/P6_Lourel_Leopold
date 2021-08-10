const mongoose = require('mongoose');    // utilisation de mongoose
const uniqueValidator = require('mongoose-unique-validator');  // package qui valide l'unique création d'un user par email

// Modèle user dans la note de cadrage
const userSchema = mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
});

// Plugin qui restreint à une création de user par adresse mail
userSchema.plugin(uniqueValidator);

// Exporte du shéma de données, pour pouvoir utiliser ce modèle pour intéragir avec l'application
module.exports = mongoose.model('User', userSchema);
