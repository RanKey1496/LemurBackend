var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config');
var bcrypt = require('bcrypt-nodejs');

var Company = require('../models/company');

function signup(req, res){
	var user = new User({
		username: req.body.username,
		password: req.body.password,
		name: {
			first: req.body.first,
			last: req.body.last
		},
		company: req.body.company
	});

	user.save(function(err, data){
		if(err){
			return res.status(400).json({success: false, 
				message: err
			});
		}

		res.json({success: true, 
			message: 'Registration successful'
		});
	});
};

function signin(req, res){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({success: false, 
			message: { 
				errors: 'Invalid username or password', 
				message: 'User validation failed', 
				name: 'ValidationError'
			}
		});
	}
	User.findOne({ username: req.body.username.toLowerCase() }, 'password role name username', function(err, user){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!user){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'User not found', 
					message: 'User validation failed', 
					name: 'ValidationError'
				}
			});
		} else if (user){
			bcrypt.compare(req.body.password, user.password, function(errB, resB){
				if(errB){
					return res.status(500).json({ success: false, 
						message: errB 
					});
				}

				if(!resB){
					return res.status(400).json({ success: false, 
						message:{ 
							errors: 'username and password do not match', 
							message: 'User validation failed', 
							name: 'ValidationError'
						}
					});
				} else {
					var token = jwt.sign({
						username: user.username,
						name: user.name,
						role: user.role
					}, config.hash_secret, {
						expiresIn: '2m'
					});

					res.json({ success: true, 
						message: token
					});
				}
			});
		}
	});
};

function addCompany(req, res){
	Company.findById(req.body.company, function(err, company){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!company){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Company select failed', 
					message: 'Company not found', 
					name: 'ValidationError'
				}
			});
		} else if (company){
			User.findById(req.body.id, function(err, user){
				if(err){
					return res.status(400).json({ success: false, 
						message: err
					});
				}

				if(!user){
					return res.status(400).json({ success: false, 
						message: { 
							errors: 'Company delete failed', 
							message: 'User not found', 
							name: 'ValidationError'
						}
					});
				} else if (user){
					if(containsObject(company.id, user.companies)){
							return res.status(400).json({ success: false, 
								message: { 
								errors: 'Company add failed', 
								message: 'Company already exist on User', 
								name: 'ValidationError'
							}
						});
					}

					user.companies.push(company);
					user.save(function(err, callback){
						if(err){
							return res.status(400).json({ success: false, 
								message: err
							});
						}

						return res.json ({ success: true,
							message: 'Company added to User'
						});
					});
				}
			})
		}
	});
};

function removeCompany(req, res){
	Company.findById(req.body.company, function(err, company){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!company){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Company select failed', 
					message: 'Company not found', 
					name: 'ValidationError'
				}
			});
		} else if (company){
			User.findById(req.body.id, function(err, user){
				if(err){
					return res.status(400).json({ success: false, 
						message: err
					});
				}

				if(!user){
					return res.status(400).json({ success: false, 
						message: { 
							errors: 'User delete failed', 
							message: 'User not found', 
							name: 'ValidationError'
						}
					});
				} else if (user){
					if(!containsObject(company.id, user.companies)){
							return res.status(400).json({ success: false, 
								message: { 
								errors: 'Comapny remove failed', 
								message: 'Company doesnt exist on the User', 
								name: 'ValidationError'
							}
						});
					}

					user.companies.remove(company);
					user.save(function(err, callback){
						if(err){
							return res.status(400).json({ success: false, 
								message: err
							});
						}

						return res.json ({ success: true,
							message: 'Company remove from user successfully'
						});
					});
				}
			})
		}
	});
}

function tokenCheck(req, res, next){
	if(req.headers && req.headers.authorization){
		var parts = req.headers.authorization.split(' ');
		if(parts.length == 2){
			token = parts[1];
		} else {
			return res.status(401).json({ success: false, 
				message: {
					errors: 'Invalid token format',
					message: 'Token validation failed',
					name: 'ValidationError'
				}
			});
		}
	} else if(req.body && req.query && req.params){
		if(req.body.token) token = req.body.token;
		if(req.query.token) token = req.query.token;
		if(req.params.token) token = req.params.token;
	} else {
		return res.status(401).json({ success: false, 
			message: {
				errors: 'Token header invalid',
				message: 'Token validation failed',
				name: 'ValidationError'
			}
		});
	}

	jwt.verify(token, config.hash_secret, function(err, decoded) {      
      	if (err) {
        	return res.status(400).json({ success: false, 
        		message: err });
      	} else {
        	req.decoded = decoded;    
        	next();
      	}
	});
};

function getAuthenticatedUser(req, res){
	return res.json({success: true, 
		message: req.decoded
	});
};

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            return true;
        }
    }

    return false;
}

module.exports = {
	tokenCheck,
	signup,
	signin,
	getAuthenticatedUser,
	addCompany,
	removeCompany
}