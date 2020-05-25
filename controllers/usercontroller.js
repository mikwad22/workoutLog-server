const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP
router.post('/user/register', (req, res) => { 
    User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    })
        .then(
            createSuccess = (user) => {
                let token = jwt.sign({
                    id: user.id
                }, process.env.JWT_SECRET,
                {expiresIn: 60*60*24})
                res.json({
                    user: user,
                    message: 'user created',
                    sessionToken: token
                })
            },
            createError = err => res.send(500, err)
        )
        .catch(err => res.status(500).json({
            error: err 
        }))
}) 

// SIGNIN
router.post('/user/login', (req, res) => {
    User.findOne({ 
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if(user){
                bcrypt.compare(req.body.password, user.password, (err, matches) => { 
                    if (matches){
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
                        res.json({
                            user: user,
                            message: 'user successfully logged in',
                            sessionToken: token
                        })
                    } else {
                        res.status(502).send({error: 'bad gateway'}) // passwords did not match
                    }
                }) 
            } else {
                res.status(500).send({error: 'failed to authenticate'}) // did not find user
            }
        }, err => res.status(501).send({error: 'failed to process'})) // issue somewhere else
})

module.exports = router;