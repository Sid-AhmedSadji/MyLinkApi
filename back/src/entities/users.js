const MongoClient = require("mongodb").MongoClient;

class Users {
  //Constructeur pour initialiser la connexion à la base de données
  constructor(db) {
    (async () => {
      this.client = await MongoClient.connect(db);
    })();
  }

  //Méthode pour créer un utilisateur dans la base de données
  async create(login, password, lastname, firstname,id) {
    try {
      const result = await this.client.db().collection('Users').insertOne({
        _id:id,
        login: login,
        password: password,
        lastname: lastname,
        firstname: firstname,
        type: "0"
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  //Méthode pour récupérer des utilisateurs basée sur l'ID, le login ou le type
  async get(userid, login,type) {
    try {
      const query = userid == null ? {} : { _id: userid };
      if (login) {
        query.login = login;
      }
      if (type) {
        query.type = type;
      }
      const result = await this.client.db().collection('Users').find(query).toArray();

      return result;
    } catch (err) {
      throw err;
    }
  }

  //Méthode pour vérifier si un utilisateur existe par son login
  async exists(login) {
    try {
      const result = await this.client.db().collection('Users').findOne({
        login: login
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  //Méthode pour vérifier le mot de passe d'un utilisateur
  async checkPassword(login, password) {
    try {
      const result = await this.client.db().collection('Users').findOne({
        login: login,
        password: password
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async

  //Méthode pour supprimer un utilisateur par son ID
  async deleteUser(id) {
    try {
      const result = await this.client.db().collection('Users').deleteOne({
        _id: id
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  //Méthode pour mettre à jour le type d'un utilisateur
  async update(id, type) {
    try {
      const result = await this.client.db().collection('Users').updateOne({
        _id: id
      }, {
        $set: {
          type: type
        }
      });
      return result;
    } catch (err) {
      throw err;
    }
    
  }
}

exports.default = Users;
