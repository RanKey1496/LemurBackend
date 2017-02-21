var Company = require('../models/company');

function create(req, res){
	var company = new Company({
		nit: req.body.nit,
		name: req.body.name
	});

	company.save(function(err, company){
		if(err){
			return res.status(400).json({success: false, 
				message: err
			});
		}

		res.json({success: true, 
			message: 'Created successfully'
		});
	});
};

function get(req, res){
	Company.findOne({ nit: req.body.nit }, 'nit name -_id', function(err, company){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!company){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Company validation failed', 
					message: 'Company not found', 
					name: 'ValidationError'
				}
			});
		} else if (company){
			res.json ({ success: true,
				message: company
			});
		}
	});
};

function update(req, res){
	var params = { name: req.body.name };
	Company.findOneAndUpdate({ nit: req.body.nit }, params, function(err, company){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!company){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Company update failed', 
					message: 'Company not found', 
					name: 'ValidationError'
				}
			});
		} else if (company){
			res.json ({ success: true,
				message: 'Updated successfully'
			});
		}
	});
};

function remove(req, res){
	Company.findOneAndRemove({ nit: req.body.nit }, function(err, company){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!company){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Company delete failed', 
					message: 'Company not found', 
					name: 'ValidationError'
				}
			});
		} else if (company){
			res.json ({ success: true,
				message: 'Deleted successfully'
			});
		}
	});
};

module.exports = {
	create,
	get,
	update,
	remove
}