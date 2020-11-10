const profileController = (req, res, db) => {
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
}

module.exports = { profileController }
