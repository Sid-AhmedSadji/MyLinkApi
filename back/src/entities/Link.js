const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sidahmedsadji:Onenoteproject@onenote.eegwv9q.mongodb.net/URL";


class Link {

    async connect() {
        this.client = await MongoClient.connect(uri);
    }

    async saveLink(link) {
        await this.connect();
        const db = this.client.db();
        const reponse = await db.collection("AllLink").insertOne(link);
        return reponse;
    }

    async getLinks(query) {
        await this.connect();
        const db = this.client.db();
        const reponse = await db.collection("AllLink").find(query).toArray();
        return reponse;
    }

    async deleteLink(query) {
        await this.connect();
        const db = this.client.db();
        const reponse = await db.collection("AllLink").deleteOne(query);
        return reponse;
    }

    async updateLink(query, update) {
        await this.connect();
        const db = this.client.db();
        const reponse = await db.collection("AllLink").updateOne( query, update);
        return reponse;
    }
}

exports.default = Link ;


