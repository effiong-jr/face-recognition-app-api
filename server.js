const express = require('express')
const cors = require('cors')
const knex = require('knex')

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

	const user = database.users.filter(
		(user) => user.email === email && user.password === password
	)[0]
	if (
		user
		// email === database.users[0].email &&
		// password === database.users[0].password
	) {
		const { id, name, email, entries, joined } = user
		res.json({
			message: 'Success',
			user: { id, name, email, entries, joined },
		})
	} else {
		res.status(400).json({ message: 'Error Logging in' })
	}
})

app.post('/register', (req, res) => {
	const { name, email, password } = req.body
	try {
		db('users')
			.insert({
				name,
				email,
				joined: new Date(),
			})
			.then(console.log)

		res.status(201).json({
			message: 'success',
			user: database.users[database.users.length - 1],
		})
	} catch {
		res.status(400).json({ message: 'Error Creating User' })
	}
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params
	const user = database.users.filter((user) => user.id === id)[0]
	if (user) {
		res.json(user)
	} else {
		res.status(404).json({ message: 'No user found' })
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body
	const user = database.users.filter((user) => user.id === id)[0]
	if (user) {
		user.entries++
		console.log(user)
		res.send({ entries: user.entries })
	} else {
		res.status(404).json({ message: 'User not found' })
	}
})

app.listen(5000, () => console.log('Server started and port 5000'))
