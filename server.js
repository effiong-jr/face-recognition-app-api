const express = require('express')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt-nodejs')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: 'division1',
		database: 'smart-brain',
	},
})

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
	res.send(database.users)
})

app.post('/signin', (req, res) => signin.signinController(req, res, db, bcrypt))

app.post('/register', (req, res) =>
	register.registerController(req, res, db, bcrypt)
)

app.get('/profile/:id', (req, res) => profile.profileController(req, res, db))

app.put('/image', (req, res) => image.imageController(req, res, db))

app.listen(5000, () => console.log('Server started and port 5000'))
