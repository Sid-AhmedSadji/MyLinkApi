const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sidahmedsadji:Onenoteproject@onenote.eegwv9q.mongodb.net/URL";


class Link {

    constructor() {
        (async () => {
            this.client = await MongoClient.connect(uri);

        })();
    }

    async saveLink(link) {
        console.log(link)
       const reponse = await this.client.db().collection("AllLink").insertOne(link);
       return reponse;
    }

    async getLinks(query) {
        const reponse = await this.client.db().collection("AllLink").find(query).toArray();
        return reponse;
    }

    async deleteLink(query) {
        const reponse = await this.client.db().collection("AllLink").deleteOne(query);
        return reponse;
    }

    async updateLink(query, update) {
        const reponse = await this.client.db().collection("AllLink").updateOne( query, update);
        return reponse;
    }
}

exports.default = Link ;

