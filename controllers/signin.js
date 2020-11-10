const signinController = (req, res, db, bcrypt) => {
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
}

module.exports = { signinController }
