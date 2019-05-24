'use strict';


const axios = require('axios');
const baseUrl = 'http://dlombard:3000';

class PoiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async authenticate(user) {
        try {
            const response = await axios.post(this.baseUrl + '/api/users/authenticate', user);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async clearAuth(user) {
        axios.defaults.headers.common['Authorization'] = '';
    }

    async getUsers() {
        try {
            const response = await axios.get(this.baseUrl + '/api/users');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getUser(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/users/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createUser(newUser) {
        try {
            const response = await axios.post(this.baseUrl + '/api/users', newUser);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllUsers() {
        try {
            const response = await axios.delete(this.baseUrl + '/api/users');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteOneUser(id) {
        try {
            const response = await axios.delete(this.baseUrl + '/api/users/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getIslands() {
        const response = await axios.get(this.baseUrl + '/api/islands');
        return response.data;
    }

    async getIsland(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/islands/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createIsland(newIsland) {
        const response = await axios.post(this.baseUrl + '/api/islands', newIsland);
        return response.data;
    }

    async deleteAllIslands() {
        const response = await axios.delete(this.baseUrl + '/api/islands');
        return response.data;
    }

    async deleteOneIsland(id) {
        const response = await axios.delete(this.baseUrl + '/api/islands/' + id);
        return response.data;
    }

    async getUsers() {
        const response = await axios.get(this.baseUrl + '/api/users');
        return response.data;
    }

    async getUser(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/users/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createUser(newUser) {
        const response = await axios.post(this.baseUrl + '/api/users', newUser);
        return response.data;
    }

    async addPicture(id, picture) {
        try {
            console.log(id);
            console.log(picture);
            const response = await axios.post(this.baseUrl +'/api/islands/' + id + '/pictures', picture);
            console.log('working')
            console.log(response.data);
            return response.data;
        } catch (e) {
            console.log('not working')
            return null;
        }
    }

    async getPictures(id) {
        try {
            console.log(id);
            const response = await axios.get(this.baseUrl +'/api/islands/' + id + '/pictures');
            console.log(response.data);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deletePictures(islandId) {
        try {
            const response = await axios.delete(this.baseUrl + '/api/islands/' + islandId + '/pictures');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllPictures() {
        try {
            const response = await axios.delete(this.baseUrl +'/api/pictures');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async addReview(id, review) {
        try {
            console.log(id);
            console.log(review);
            const response = await axios.post(this.baseUrl +'/api/islands/' + id + '/reviews', review);
            console.log('working')
            console.log(response.data);
            return response.data;
        } catch (e) {
            console.log('not working')
            return null;
        }
    }

    async getReviews(id) {
        try {
            console.log(id);
            const response = await axios.get(this.baseUrl +'/api/islands/' + id + '/reviews');
            console.log(response.data);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteReviews(islandId) {
        try {
            const response = await axios.delete(this.baseUrl + '/api/islands/' + islandId + '/reviews');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllReviews() {
        try {
            const response = await axios.delete(this.baseUrl +'/api/reviews');
            return response.data;
        } catch (e) {
            return null;
        }
    }
}

module.exports = PoiService;