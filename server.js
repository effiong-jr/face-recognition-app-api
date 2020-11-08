const express = require('express')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

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

app.post('/signin', (req, res) => {
	const { email, password } = req.body

	db('login')
		.where({ email: email })
		.select('email', 'hash')
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash)
			if (isValid) {
				return db('users')
					.where('email', '=', email)
					.select('*')
					.then((users) => {
						res.json({
							message: 'User fetched successfully',
							user: users[0],
						})
					})
			} else {
				res.status(400).json({ message: 'Invalid credentials' })
			}
		})
		.catch((error) => {
			res.status(400).json('Error signing in')
		})
})

app.post('/register', (req, res) => {
	const { name, email, password } = req.body

	const hash = bcrypt.hashSync(password)

	db.transaction((trx) => {
		return trx
			.insert({ email, hash })
			.into('login')
			.returning('email')
			.then((loginEmail) => {
				return trx('users')
					.returning('*')
					.insert({ name, email: loginEmail[0], joined: new Date() })
					.then((user) => {
						console.log(user[0])
						res.json(user[0])
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
	}).catch((error) => {
		res.status(400).json({ message: 'Unable to register', error })
	})
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params

	db('users')
		.where({ id })
		.then((data) => {
			if (!data[0]) {
				res.status(404).json({ message: 'User not found.' })
			}
			res.json(data)
		})
		.catch((error) => {
			console.log(error)
			res.status(400).json({ error: 'There was an error' })
		})
})

app.put('/image', (req, res) => {
	const { id } = req.body
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0])
		})
		.catch((error) => {
			res.status(400).json({ message: 'An error occured' })
		})
})

app.listen(5000, () => console.log('Server started and port 5000'))
