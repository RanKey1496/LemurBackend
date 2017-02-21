module.exports = {
    hash_secret: 'lemur',
	port: process.env.PORT || 3000,
	db: process.env.MONGODB || 'mongodb://nomiente:nomiente@ds157349.mlab.com:57349/lemur'
};