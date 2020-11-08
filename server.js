const express = require('express')
const cors = require('cors')
const knex = require('knex')
const { response, json } = require('express')

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

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'debull@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date(),
		},
		{
			id: '124',
			name: 'Debull',
			email: 'user@gmail.com',
			password: 'node',
			entries: 0,
			joined: new Date(),
		},
	],
}

app.get('/', (req, res) => {
	res.send(database.users)
})

app.post('/signin', (req, res) => {
	const { email, password } = req.body

	db('users')
		.where({
			email,
			// password,
		})
		.select('id', 'name', 'entries', 'joined')
		.then((user) => {
			res.json({ message: 'Success', user: user[0] })
		})
		.catch((error) => {
			res.status(400).json({ message: 'Error signin in' })
		})
})

app.post('/register', (req, res) => {
	const { name, email, password } = req.body
	db('users')
		.returning('*')
		.insert({
			name,
			email,
			joined: new Date(),
		})
		.then((user) => {
			res.status(201).json(user[0])
		})
		.catch((error) => {
			if (error.code === '23505') {
				res.status(400).json({ message: 'User already exist.' })
			} else {
				res.status(400).json({ message: 'Registration failed!' })
			}
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
