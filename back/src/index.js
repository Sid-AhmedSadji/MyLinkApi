const routes = require('./app.js');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 7000;


app.use(cors());


app.use(routes.default());    

app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur le port http://localhost:${port}`);
});
