const express = require('express')
const cors = require('cors')

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
	console.log(req.body)
	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		res.json({ message: 'Success' })
	} else {
		res.status(400).json({ message: 'Error Logging in' })
	}
})

app.post('/register', (req, res) => {
	try {
		const newUser = {
			id: '125',
			...req.body,
			entries: 0,
			joined: new Date(),
		}
		database.users.push(newUser)

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
		res.json(user.entries)
	} else {
		res.status(404).json({ message: 'User not found' })
	}
})

app.listen(5000, () => console.log('Server started and port 5000'))

/*
End points

/ => GET = res = Home page
/signin => POST = user
/register => POST = user
/profile/:userId -> GET = user
/image => PUT = user 


*/
