const multer = require('multer');  // Mutler permet de gérer les fichiers entrants dans les réquetes HTTP

const MIME_TYPES = {    // accepter les differents formats d'images
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

//lieu d'enregistrement et nom du fichier
const storage = multer.diskStorage({ //Précise à multer ou enregister les fichiers et les renommer
    destination: (req, file, callback) => { //Destination d'enregistrement
        callback(null, 'images'); //Dossier images
    },
    filename: (req, file, callback) => { //renommage des fichiers
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + '.' + extension); //Timestamp + extansion permet d'avoir un nom de fichier unique
    }
});

// On export le module, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({storage: storage}).single('image');
