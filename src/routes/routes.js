const express = require('express');
const router = express.Router();
const user = require('../controllers/UserController')
const auth = require('../middleware/auth')


router.get('/', auth, (req,res) => {
    res.send({status: 200, data:'hello there! Welcome to the restaurant api'})
})

router.post('/register', user.registerUser);

router.post('/login', user.login);

router.post('/order',auth, user.order);

router.post('/processOrder', auth, user.processOrder);

router.get('/getPendingOrders', auth, user.getPendingOrders);

router.get('/getAllUsers', auth, user.getAllUsers);

router.get('/getAllInvoices', auth, user.getAllInvoices);

module.exports = router;