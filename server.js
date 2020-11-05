const express = require('express')

const app = express()

app.get('/', (req, res) => {
	res.send('Working')
})

// app.post('/signin',)

app.listen(5000, () => console.log('Server started and port 5000'))

/*
End points

/ => GET = res = Home page
/signin => POST = user
/register => POST = user
/profile/:userId -> GET = user
/image => PUT = user 


*/
