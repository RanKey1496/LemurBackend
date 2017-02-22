var PlayList = require('../models/playlist');
var Song = require('../models/song');

function create(req, res){
	var playlist = new PlayList({
		name: req.body.name,
		creator: req.body.creator,
	});

	playlist.save(function(err, playlist){
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
	PlayList.findOne({ _id: req.body.id }, 'name creator songs', function(err, playlist){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!playlist){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Playlist validation failed', 
					message: 'Playlist not found', 
					name: 'ValidationError'
				}
			});
		} else if (playlist){
			res.json ({ success: true,
				message: playlist
			});
		}
	});
};

function update(req, res){
	var params = {};
	if(req.body.name && req.body.creator) {
		params = { name: req.body.name, creator: req.body.creator };
	} else if(req.body.name){
		params = { name: req.body.name };
	} else if(req.body.creator){
		params = { creator: req.body.creator };
	} else {
		return res.status(400).json({ success: false,
			message: { 
					errors: 'PlayList update failed', 
					message: 'Not enough params', 
					name: 'ValidationError'
			}
		});
	}

	
	PlayList.findOneAndUpdate({ _id: req.body.id }, params, function(err, playlist){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!playlist){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'PlayList update failed', 
					message: 'PlayList not found', 
					name: 'ValidationError'
				}
			});
		} else if (playlist){
			res.json ({ success: true,
				message: 'Updated successfully'
			});
		}
	});
};

function remove(req, res){
	PlayList.findOneAndRemove({ _id: req.body.id }, function(err, playlist){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!playlist){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Playlist delete failed', 
					message: 'Playlist not found', 
					name: 'ValidationError'
				}
			});
		} else if (playlist){
			res.json ({ success: true,
				message: 'Deleted successfully'
			});
		}
	});
};

function addSong(req, res){
	Song.findById(req.body.song, function(err, song){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!song){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Song select failed', 
					message: 'Song not found', 
					name: 'ValidationError'
				}
			});
		} else if (song){
			PlayList.findById(req.body.id, function(err, playlist){
				if(err){
					return res.status(400).json({ success: false, 
						message: err
					});
				}

				if(!playlist){
					return res.status(400).json({ success: false, 
						message: { 
							errors: 'Playlist delete failed', 
							message: 'Playlist not found', 
							name: 'ValidationError'
						}
					});
				} else if (playlist){
					playlist.songs.push(song);
					playlist.save(function(err, callback){
						if(err){
							return res.status(400).json({ success: false, 
								message: err
							});
						}

						return res.json ({ success: true,
							message: 'Song added to playlist'
						});
					});
				}
			})
		}
	});

	/*PlayList.findOneAndUpdate({ _id: req.body.id }, {$push: {songs: {ObjectId: req.body.song}}}, function(err, playlist){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!playlist){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Playlist delete failed', 
					message: 'Playlist not found', 
					name: 'ValidationError'
				}
			});
		} else if (playlist){
			res.json ({ success: true,
				message: 'Song added to playlist'
			});
		}
	})*/

	/*Contact.findByIdAndUpdate(
        info._id,
        {$push: {"messages": {title: title, msg: msg}}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            console.log(err);
        }
    );*/
};

module.exports = {
	create,
	get,
	update,
	remove,
	addSong
}