import axios from 'axios';

class Api {
    static get API_URL() {
        return "http://localhost:7000/Api";
    }

    static async getLinks(query) {
        const response = await axios.get(this.API_URL, { params: query });
        return response.data;
    }

    static async updateLink(id, query) {
        const response = await axios.put(this.API_URL, null, { params: { id, query } });
        return response.data;
    }

    static async deleteLink(_id) {
        const response = await axios.delete(this.API_URL, { params: { _id } });
        return response.data;
    }

    static async postLink(query) {
        const response = await axios.post(this.API_URL, null, { params: query });
        return response.data;
    }
}

export default Api;
