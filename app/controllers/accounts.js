'use strict';
const User = require('../models/user');
const Island = require('../models/island');
const Admin = require('../models/admin');

const Joi = require('joi');

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to Islands' });
        }
    },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Islands' });
        }
    },
    signup: {
        auth: false,
        //setting validation rules for the entered parameters
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const payload = request.payload;

                //checks if email address is already in use - displays boom message if so
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = 'Email address is already registered';
                    throw new Boom(message);
                }

                //creates new user based on the info passed in from the registration form
                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: payload.password
                });

                //saves the new user and generstes cookie
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });

                //redirect new user to the home page
                return h.redirect('/home');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Islands' });
        }
    },
    login: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('login', {
                        title: 'Sign in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                //seeeing if there is a normal user or admin with the entered email
                let user = await User.findByEmail(email);
                let admin = await Admin.findByEmail(email);

                //if no match throw boom message saying so
                if (!user && !admin) {
                    const message = 'Email address is not registered';
                    throw new Boom(message);
                }

                //if user email and password is correct - creates cookie and redirects to home page
                //else if admin and password is correct - creates cooke and redirects to admin dashboard and passes info
                if(user){
                    user.comparePassword(password);
                    request.cookieAuth.set({ id: user.id });
                    return h.redirect('/home');

                } else if (admin){
                    admin.comparePassword(password);
                    request.cookieAuth.set({ id: admin.id });
                    const islands = await Island.find().populate('addedBy');
                    const users = await User.find();
                    console.log(islands);
                    console.log(users);
                    return h.view('admindashboard', {islands : islands, users: users});
                }
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    logout: {
        auth: false,
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    },
    deleteAccount: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                await user.remove();
                return h.redirect('/login');
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    adminDeleteAccount: {
        //method to allow administor to delete any user account
        handler: async function(request, h) {
            try {
                //getting rid of trailing "'in userId passed in through route
                const userId = request.params.userid ;
                var correctUserId = userId.slice(0, -1);

                //finds user with id and removes
                const user = await User.findById(correctUserId);
                await user.remove();

                //redefining parameters to be passed to admindashboard
                const users = await User.find();
                const islands = await Island.find().populate('addedBy');

                return h.view('admindashboard', {users : users, islands : islands });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                return h.view('settings', { title: 'Islands - POI Settings', user: user });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    updateSettings: {
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('settings', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                //setting user credentials to whatever was passed through settings form
                const userEdit = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/settings');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    }
};

module.exports = Accounts;