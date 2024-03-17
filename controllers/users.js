const { prisma } = require('../prisma/prisma-client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

// LOGIN
const login = async (req, res) => {
	const { email, password } = req.body

	try {
		if (!email || !password)
			return res.status(400).json({ message: 'Enter email and password' })

		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		})

		const isPasswordCorrect =
			user && (await bcrypt.compare(password, user.password))

		if (user && isPasswordCorrect && secret) {
			res.status(200).json({
				id: user.id,
				email: user.email,
				name: user.name,
				token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
			})
		} else {
			return res
				.status(400)
				.json({ message: 'Incorrectly entered password or login' })
		}
	} catch {
		res.status(500).json({ message: 'Error login' })
	}
}

// REGISER
const register = async (req, res) => {
	const { email, password, name } = req.body

	try {
		if (!email || !password || !name) {
			return res.status(400).json({ message: 'Enter email, password and name' })
		}

		const isRegisterUser = await prisma.user.findFirst({
			where: {
				email,
			},
		})

		if (isRegisterUser)
			return res.status(400).json({ message: 'A user with this email exists' })

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
		})

		if (user && secret) {
			res.status(201).json({
				id: user.id,
				email: user.email,
				name,
				token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
			})
		} else {
			return res.status(400).json({ message: 'No created user' })
		}
	} catch {
		res.status(500).json({ message: 'Error register' })
	}
}

// CURRENT
const current = async (req, res) => {
	return res.status(200).json(req.user)
}

module.exports = {
	login,
	register,
	current,
}
