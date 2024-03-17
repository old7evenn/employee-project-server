const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
const usersRouter = require('./routes/users.js')
const employeesRouter = require('./routes/employees.js')
const cors = require('cors')

const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/user', usersRouter)
app.use('/api/employees', employeesRouter)

const start = async () => {
	try {
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (error) {
		console.log(error)
	}
}

start()