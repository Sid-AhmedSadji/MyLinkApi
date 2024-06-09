import axios from 'axios';
import React from 'react';



class Api {
    
    static url = "https://mylinkapi.onrender.com/Api" ; 

    static async getLinks (query) {
        const reponse = await axios.get(Api.url, {params: query});
        return reponse.data;

    }

    static async updateLink(id, query) {
        console.log(id, query)
        const reponse = await axios.put(Api.url,null, {params : { id, query }});
        return reponse.data;
    }

    static async deleteLink(_id) {
        const reponse = await axios.delete(Api.url, {params : { _id }});
        return reponse.data;
    }

    static async postLink(query) {
        const reponse = await axios.post(Api.url, null,{params :query});
        return reponse.data;
    }

}

export default Api