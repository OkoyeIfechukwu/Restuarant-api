const userSchema = require('../models/User')
const orderSchema = require('../models/Order')
const invoiceSchema = require('../models/Invoice')
const bcrypt = require('bcrypt')
const jwtUtil = require('../security/jwtUtil')
const {RandomToken} = require('@sibevin/random-token')


const user = {

    registerUser: async (req, res) => {
        const {username, firstName, lastName, password, email, phone} = req.body

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userSchema.findOne({username}).then(user => {
            if (user) {
                return res.status(400)
                    .json({
                        status: 400,
                        message: 'User with username already exists',
                        data: null,
                    })
            }
        }).catch(err => {
            return res.status(400).json({status: 400, message: err, data: null});
        })

        const newUser = new userSchema({
            username,
            firstName,
            lastName,
            phone,
            password: hashedPassword,
            email,
        });

        newUser.save().then((user) => {
            return res.json({
                status: 200,
                message: 'Success, User created successfully',
                data: {username: user.username}
            })
        }).catch((error) => {
            return res.status(400).json({status: 400, message: error, data: null});
        })

    },

    login: async (req, res) => {
        const username = req.query.username
        const password = req.query.password

        await userSchema.findOne({username}).then((user) => {

            if (!user) {
                return res.status(400).json({status: 400, message: 'User not found', data: null});
            }

            if (bcrypt.compare(password, user.password)) {
                const token = jwtUtil.createToken(user);
                return res.json({
                    status: 200,
                    message: 'Success, Login Success created successfully',
                    data: {username: user.username, token}
                })
            }

        }).catch((error) => {
            return res.status(400).json({status: 400, message: error, data: null});
        });
    },
    order: async (req, res) => {
        const {orderDetails, plates} = req.body;

        if (!orderDetails) {
            return res.status(400).json({status: 404, message: 'Order Details is required', data: null});
        }

        if (!plates) {
            return res.status(400).json({status: 404, message: 'Number of plates is required', data: null});
        }

        const token = req.header('Authorization').replace('Bearer ', '')
        const user = await jwtUtil.getUser(token)

        if (!user) {
            return res.status(400).json({status: 400, message: 'User not found', data: null});
        }

        const newOrder = new orderSchema({
            OrderDetails: orderDetails,
            OrderId: (user.firstName.substr(0, 1) + user.lastName.substring(0, 1) + user.username.substring(0, 1) + RandomToken.gen({length: 5})).toUpperCase(),
            OrderDate: new Date(),
            UserId: user._id,
            Price: 300,
            Plates: plates
        })

        newOrder.save().then((order) => {
            return res.json({
                status: 200,
                message: 'Success, Order created successfully',
                data: {orderId: order.OrderId}
            })

        }).catch(error => {
            return res.status(400).json({status: 400, message: error, data: null});
        })
    },
    processOrder: async (req, res) => {
        const orderId = req.query.orderId

        if (!orderId) {
            return res.status(400).json({status: 404, message: 'Order Id is required', data: null});
        }

        let orderObject = undefined

        await orderSchema.findOneAndUpdate({OrderId: orderId}, {Active: 'RESOLVED'}).then(order => {
            if (!order) {
                return res.status(400).json({status: 404, message: 'Order not found', data: null});
            }
            orderObject = order._doc
        }).catch(err => {
            return res.status(400).json({status: 400, message: err.message, data: null});
        })

        await userSchema.findOne({_id: orderObject.UserId}).then(user => {

            const {OrderId, Price, OrderDetails, OrderDate} = orderObject
            const {firstName, lastName} = user

            if (!user) {
                return res.status(400).json({status: 400, message: 'User not found', data: null});
            }
            const newInvoice = new invoiceSchema({
                CustomerName: (lastName + ' ' + firstName).toUpperCase(),
                OrderId,
                Price,
                OrderDetails,
                OrderDate
            })

            newInvoice.save().then(invoice => {
                return res.json({
                    status: 200,
                    message: 'Success, Order has been processed',
                    data: invoice
                })
            }).catch(err => {
                return res.status(400).json({status: 400, message: err, data: null});
            })
        }).catch(err => {
            return res.status(400).json({status: 400, message: err, data: null});
        })


    },
    getPendingOrders: async (req, res) => {
        await orderSchema.find({Active: 'ACTIVE'}).then((orders) => {

            if (!orders) {
                return res.status(200).json({status: 200, message: 'No Pending orders at the moment', data: null});
            }

            return res.json({status: 200, message: 'All Pending Orders', data: {orders}});
        })
    },
    getAllUsers: async (req, res) => {
        await userSchema.find().then(users => {
            if (!users) {
                return res.status(200).json({status: 200, message: 'No Users at the moment', data: null});
            }
            return res.json({status: 200, message: 'Users List', data: {users}});
        })
    },
    getAllInvoices: async (req, res) => {
        await invoiceSchema.find().then(invoices => {
            if (!invoices) {
                return res.status(200).json({status: 200, message: 'No Invoices at the moment', data: null});
            }
            return res.json({status: 200, message: 'Invoice List', data: {invoices}});
        })
    }
}

module.exports = user;

