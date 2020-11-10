const registerController = (req, res, db, bcrypt) => {
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
						res.json(user[0])
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
	}).catch((error) => {
		res.status(400).json({ message: 'Unable to register', error })
	})
}

module.exports = {
	registerController,
}
