const MongoClient = require("mongodb").MongoClient;

class Messages {
    //Constructeur pour initialiser la connexion à la base de données
    constructor(db) {
        (async () => {
          this.client = await MongoClient.connect(db);
        })();
    }

    //Méthode asynchrone pour créer un message dans la base de données
    async create(message,  date, author_name, id_Parent, title,privacy) {

        try {
            const result = await this.client.db().collection('Messages').insertOne({
                message: message,
                date: date,
                author_name: author_name,
                id_Parent: id_Parent,
                title: title,
                privacy: privacy,
                reports: []
            })
            return result; //Retourne le résultat de l'insertion
        } catch (err) {
            throw err; //Lance une exception en cas d'erreur
        }
    }

    //Méthode asynchrone pour obtenir des messages de la base de données
    async get(id,privacy) {
        try {
            const query = id == null ? {} : { _id: id }; //Construit la requête de base
            privacy ? query.privacy = privacy : null //Ajoute le filtre de confidentialité si présent
            const result = await this.client.db().collection('Messages').find(query).toArray();
            return result; //Retourne les messages trouvés 
        } catch (err) {
            throw err;
        }
    }

    //Méthode asynchrone pour vérifier l'existence d'un message par son titre
    async exists(title) {
        try {
            const result = await this.client.db().collection('Messages').findOne({
                title: title
            });
            return result; //Retourne le message s'il existe, sinon null
        } catch (err) {
            throw err;
        }
    }

    //Méthode asynchrone pour supprimer un message de la base de données
    async delete(id) {

        try {
            const result = await this.client.db().collection('Messages').deleteOne({
                _id: id
            });
            console.log(result)
            return result; //Retourne le résultat de la suppression
        } catch (err) {
            throw err;
        }
    }

    //Méthode asynchrone pour ajouter un signalement a un message prends en parametre l'id d'un message et l'id d'un utilisateur
    async reportMessage(id, author_name) {
        try {
            const result = await this.client.db().collection('Messages').updateOne(
                { _id: id }, // Utilise ObjectId pour l'ID du message
                {
                    $push: {
                        reports: author_name // Ajoute l'auteur au tableau des reports
                    }
                }
            );
            return result; // Retourne le résultat de la mise à jour
        } catch (error) {
            console.error("Error while reporting message:", error);
            throw error; // Lance une nouvelle erreur pour indiquer qu'il y a eu une erreur dans la mise à jour
        }
    }
    
}

exports.default = Messages ;