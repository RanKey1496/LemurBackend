var Company = require('../models/company');
var PlayList = require('../models/playlist');

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

function getAll(req, res){
	Company.find({}, 'id name nit playlists', function(err, companies){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!companies){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Company validation failed', 
					message: 'Company not found', 
					name: 'ValidationError'
				}
			});
		} else if (companies){
			res.json ({ success: true,
				message: companies
			});
		}
	});
}

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

function addPlayList(req, res){
	PlayList.findById(req.body.playlist, function(err, playlist){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!playlist){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Playlist select failed', 
					message: 'Playlist not found', 
					name: 'ValidationError'
				}
			});
		} else if (playlist){
			Company.findById(req.body.id, function(err, company){
				if(err){
					return res.status(400).json({ success: false, 
						message: err
					});
				}

				if(!company){
					return res.status(400).json({ success: false, 
						message: { 
							errors: 'Playlist add failed', 
							message: 'Company not found', 
							name: 'ValidationError'
						}
					});
				} else if (company){
					if(containsObject(playlist.id, company.playlists)){
							return res.status(400).json({ success: false, 
								message: { 
								errors: 'Playlist add failed', 
								message: 'Playlist already exist on Company', 
								name: 'ValidationError'
							}
						});
					}

					company.playlists.push(playlist);
					company.save(function(err, callback){
						if(err){
							return res.status(400).json({ success: false, 
								message: err
							});
						}

						return res.json ({ success: true,
							message: 'PlayList added to Company'
						});
					});
				}
			})
		}
	});
};

function removePlayList(req, res){
	PlayList.findById(req.body.playlist, function(err, playlist){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		}

		if(!playlist){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Playlist select failed', 
					message: 'Playlist not found', 
					name: 'ValidationError'
				}
			});
		} else if (playlist){
			Company.findById(req.body.id, function(err, company){
				if(err){
					return res.status(400).json({ success: false, 
						message: err
					});
				}

				if(!company){
					return res.status(400).json({ success: false, 
						message: { 
							errors: 'Playlist delete failed', 
							message: 'Company not found', 
							name: 'ValidationError'
						}
					});
				} else if (company){
					if(!containsObject(playlist.id, company.playlists)){
							return res.status(400).json({ success: false, 
								message: { 
								errors: 'Playlist remove failed', 
								message: 'Playlist doesnt exist on the Company', 
								name: 'ValidationError'
							}
						});
					}

					company.playlists.remove(playlist);
					company.save(function(err, callback){
						if(err){
							return res.status(400).json({ success: false, 
								message: err
							});
						}

						return res.json ({ success: true,
							message: 'Playlist remove from Company successfully'
						});
					});
				}
			})
		}
	});
}

function search(req, res){
	var regex = new RegExp(req.body.name, 'i');
	Company.find({name: regex}, {'name':1}, function(err, companies){
		if(err){
			return res.status(400).json({ success: false, 
				message: err
			});
		} 

		if(!companies){
			return res.status(400).json({ success: false, 
				message: { 
					errors: 'Company validation failed', 
					message: 'Company not found', 
					name: 'ValidationError'
				}
		});

		} else if (companies){
			res.json ({ success: true,
				message: companies
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
	addPlayList,
	removePlayList,
	search
}