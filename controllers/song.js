var Song = require('../models/song');

function create(req, res){
	var song = new Song({
		name: req.body.name,
		artist: req.body.artist,
		album: req.body.album,
		duration: req.body.duration,
		url: req.file.path
	});

	song.save(function(err, company){
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
	Song.findOne({ _id: req.body.id }, 'url name artist _id duration', function(err, song){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!song){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Song validation failed', 
					message: 'Song not found', 
					name: 'ValidationError'
				}
			});
		} else if (song){
			res.json ({ success: true,
				message: song
			});
		}
	});
};

function getAll(req, res){
	Song.find({}, 'id url name artist duration', function(err, songs){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!songs){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Song validation failed', 
					message: 'Song not found', 
					name: 'ValidationError'
				}
			});
		} else if (songs){
			res.json ({ success: true,
				message: songs
			});
		}
	});
}

function update(req, res){
	var params = { name: req.body.name };
	Song.findOneAndUpdate({ _id: req.body.id }, params, function(err, song){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!song){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Song update failed', 
					message: 'Song not found', 
					name: 'ValidationError'
				}
			});
		} else if (song){
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

function search(req, res){
	var regex = new RegExp(req.body.name, 'i');
	Song.find({name: regex}, {'name':1}, function(err, songs){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		} 

		if(!songs){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Song validation failed', 
					message: 'Song not found', 
					name: 'ValidationError'
				}
			});
		} else if (songs){
			res.json ({ success: true,
				message: songs
			});
		}
	})
}

module.exports = {
	create,
	get,
	getAll,
	update,
	remove,
	search
}