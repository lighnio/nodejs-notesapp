const express = require('express');
const router = express.Router();



router.get('/users/signin', (req, res) => {
    res.send('Entering to the app');
});

router.get('/users/singup', (req, res) => {
    res.send('Formulario de autenticacion');
});

module.exports = router;