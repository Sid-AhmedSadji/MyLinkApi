//App.js

const { ObjectId } = require('mongodb'); //Utilisé pour convertir les ID en format MongoDB ObjectId
const express = require("express"); //Framework pour créer le serveur HTTP
const Users = require("./entities/users.js"); //Module pour les opérations liées aux utilisateurs
const Messages = require("./entities/messages.js"); //Module pour les opérations liées aux messages

//Fonction pour initialiser les routes
function init(dbUrl) {

    const router = express.Router(); //Crée un nouveau routeur
    // On utilise JSON
    router.use(express.json()); //Middleware pour analyser le corps JSON des requêtes entrantes
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware

    //Middleware pour logger les requêtes
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        console.log('Query', req.query);
        next(); //Passe à la prochaine fonction de middleware ou route
    });

    const users = new Users.default(dbUrl); //Instancie la gestion des utilisateurs
    const messages = new Messages.default(dbUrl); //Instancie la gestion des messages

    //Route pour obtenir des messages
    router.get("/messages",async (req, res) => {

        try {
            //Vérifie si l'utilisateur est connecté en vérifiant la session
            const userid = req.session?.userid;
            if (!userid) {
                res.status(401).json({
                    message: "User not logged in"
                });
                return;
            }

            //Extraction des paramètres de requête : `id` et `privacy`
            const { id, privacy } = req.query;
            const newObectId = id ? new ObjectId(id) : null;
            
            //Récupération des messages de la base de données
            const result = await messages.get(newObectId, privacy);
            if (!result) {
                res.status(404).json({ message: "No messages found" });
                return;
            }
            //Si des messages sont trouvés, les retourner avec un statut 200
            res.status(200).json({ message: "Messages found", messages: result });
        }catch (e) {
            //En cas d'erreur, envoyer un 500 Internal Server Error
            res.status(500).send({ message: "Internal server error", error: e });
        }
    });

    router.put("/report", async (req, res) => {
        try {
            const { id, author_name } = req.body;
            console.log(id, author_name);
            const newObjectId = new ObjectId(id);
            console.log(newObjectId);
            const nbReports = await messages.reportMessage(newObjectId, author_name);
            console.log(nbReports);
            res.status(200).send({ message: `Message reported, now has ${nbReports} reports` });
        } catch (e) {
            res.status(500).send({ message: "Internal server error", error: e });
        }
    });

    //Route pour changer le type d'utilisateur
    router.post("/changeType", async (req, res) => {
        try {
            const { id,type } = req.body;
            const newObectId = new ObjectId(id) 
            const user = await users.get(newObectId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const reponse = await users.update(newObectId, type);


            if (!reponse) {
                res.status(500).send({ message: "Internal server error" });
                return;
            }
            res.status(200).send({ message: "User updated" });
        }catch(e){
            res.status(500).send({message: "Internal server error", error : e });
    }})

    //Route pour créer un nouveau message
    router.post("/message", async (req, res) => {
        try {

            let { userid, message, id_Parent, title, date, privacy } = req.body;


            // verifie que les paramettres ne sont pas nul et affiche celui qui est nul
            if (!userid || !message || !id_Parent || !title || !date) {

                res.status(400).json({
                    message: "Missing parameters"
                })
                return;
            }
            const newObjectId = new ObjectId(userid)
            const user = await users.get(newObjectId);
            const author_name = user[0].login;
            if (id_Parent !== "0"){
                id_Parent = new ObjectId(id_Parent)
            }
            if (await messages.exists(title)) {
                res.status(400).json({
                    message: "Title already exists"
                })
                return;
            }
            const reponse = await messages.create(message, date, author_name, id_Parent, title, privacy);

            res.status(201).json({ message: "Message created", message: reponse });
        } catch (e) {
            res.status(500).send({ message: "Internal server error", error: e });
        }
    });

    //Route pour supprimer un message
    router.delete("/message/:id", async (req, res) => {

        try {
            const { id } = req.params;
            const newObjectId = new ObjectId(id)
            const reponse = await messages.delete(newObjectId);
            if (!reponse) {
                res.status(500).send({ message: "Internal server error" });
                return;
            }
            res.status(200).send({ message: "Message deleted" });
        } catch (e) {
            res.status(500).send({ message: "Internal server error", error: e });
        }
    });

    //Route pour vérifié l'état de la session
    router.get("/session", (req, res) => {
        try{
            //Vérifier si l'ID de l'utilisateur est stocké dans la session
            if (req.session.userid) {
                //Si l'utilisateur est connecté, renvoie un statut 200 avec des détails de l'utilisateur
                res.status(200).json({
                    message: "User logged in",
                    userid: req.session.userid,
                    usertype: req.session.usertype
                });
            }
            else {
                //Si aucun utilisateur n'est connecté, renvoie un statut 401
                res.status(401).json({
                    message: "User not logged in"
                });
            }
        }catch(e){
            //En cas d'erreur du serveur, renvoie un statut 500
            res.status(500).send({message: "Internal server error", error : e });
        }
    });

    //Route pour créer une session utilisateur après une connexion réussie
    router.post("/user/login", async (req, res) => {

        try {
            const { login, password } = req.body; //Extraire login et password du corps de la requête

            // Erreur sur la requête HTTP (Vérifie si le login et le password sont présents dans la requête)
            if (!login || !password) {
            	res.status(400).json({
                    status: 400,
                    message: "Requête invalide : login et password nécessaires"
                });
                return;
            }

            //Vérifie si l'utilisateur existe dans la base de données
            if(! await users.exists(login)) {
            	res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            
            //Vérifier le mot de passe de l'utilisateur
            let user = await users.checkPassword(login, password);

            if (user) {
                // Avec middleware express-session(Si le mot de passe est correct, régénére la session pour la sécurité)
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée (Si la session est régénérée avec succès, enregistre l'id et le type de l'utilisateur dans la session)
                        req.session.userid = user._id;
                        req.session.usertype =  user.type;
                        res.status(200).json({
                            status: 200,
                            id: user._id,
                            usertype: user.type,
                            message: "Login et mot de passe accepté"
                        });
                    }
                });
                return;
            }
            // Faux login : destruction de la session et erreur (Si le mot de passe est incorrect, détruit la session et retourner une erreur)
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    //logout
    router.get("/user/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({
                    message: "Erreur interne"
                });
            }
            else {
                res.status(200).json({
                    message: "Logout reussi"
                });
            }
        });
    })


    router
        //Crée une route de base pour "/users"
        .route("/users")

        //Route pour récupérer diffèrent utilisateur
        .get(async (req, res) => {

        try {
            const {login=null,id=null,type=null} = req.query;

            const newObectId = id ? new ObjectId(id) : null;

            const user = await users.get(newObectId,login,type);
            if (user.length == 0)
                res.sendStatus(404); //Aucun utilisateur trouvé
            else
                res.status(200).send(user); //Envoie les utilisateurs trouvés
        }
        catch (e) {
            res.status(500).send(e); //Erreur serveur
        }
    })//fait

    //Route pour supprimer un utilisateur spécifique
    .delete(async(req, res, next) => {
    try {
        const user = await users.deleteUser(req.params.user_id);
        if (!user)
            res.sendStatus(404);
        else
            res.status(200).send("User deleted");
    }
    catch (e) {
        res.status(500).send(e);
    }
    });

    //fait
    //Route permet de créer un nouvel utilisateur
    router.post("/user", async (req, res) => {
        const { login, password, lastname, firstname } = req.body;
        if (!login || !password || !lastname || !firstname) {
            res.status(400).send("Missing fields");
        } else {
            try{
                if (await users.exists(login)) {
                    res.status(409).send("User already exists");
                    return;
                }

                const result = await users.create(login, password, lastname, firstname);
                if (result) {
                    res.status(200).send("User created");
                } else {
                    res.status(500).send("Error creating user");
                }
            }catch(e){
                res.status(500).send(e);
            }
        }
    });




    return router; //Retourne le routeur configuré
}

exports.default = init; 
