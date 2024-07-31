const express = require('express');
const Links = require('./entities/Link.js');
const { ObjectId } = require('mongodb');

function routes() {

    const router = express.Router();
    const Link = new Links.default();

    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Query', req.query);
        console.log('Params', req.params);
        next();
    })

    router.get("/", (req, res) => {
        try {
            const query = { ...req.query };
            Link.getLinks(query).then((reponse) => {
                res.status(200).json(reponse);
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    });

    router.post("/", (req, res) => {
        try {
            const link = { ...req.query };
            link.liked === "true" ? link.liked = true : link.liked = false
            link.isDead === "true" ? link.isDead = true : link.isDead = false
            link.date = new Date(link.date);
            link.review = parseInt(link.review)
            if (!link.link) {
                res.status(400).send("an Link object is required");
                return;
            }
            Link.saveLink(link).then((reponse) => {
                res.status(200).json(reponse);
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.delete("/", (req, res) => {
        try {
            const query = { _id: new ObjectId(req.query._id) };
            if (!query._id) {
                res.status(400).send(" Unidentified Link");
                return;
            }
            Link.deleteLink(query).then((reponse) => {
                res.status(200).json(reponse);
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.put("/", (req, res) => {
        try {

            const query = { _id: new ObjectId(req.query.id) }; 
            
            if ( req.query.query.liked ) {
                req.query.query.liked = req.query.query.liked === "true" ? true : false

            }

            if ( req.query.query.isDead ) {
                req.query.query.isDead = req.query.query.isDead === "true" ? true : false

            }

            if ( req.query.query.review ) {
                req.query.query.review = parseInt(req.query.query.review)
            }

            if ( req.query.query.date ) {
                req.query.query.date = new Date(req.query.query.date)
            }


            
            const update = { $set: { ...req.query.query } };
            if (!query._id) {
                res.status(400).send(" Unidentified Link");
                return;
            }
            
            if (!update.$set) {
                res.status(400).send("an Link object is required");
                return;
            }

            Link.updateLink(query, update).then((reponse) => {
                res.status(200).json(reponse);
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.use((req, res) => {
        res.status(404).send("Page not found !");
    });

    return router;

}

exports.default = routes;