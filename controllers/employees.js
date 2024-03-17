const {prisma} = require('../prisma/prisma-client')

const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany()

    res.status(200).json(employees)
  } catch {
    res.status(500).json({message: 'Error getting employees'})
  }
}

const add = async (req, res) => {
	try {
    const data = req.body

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({message: 'Enter all data'})
    }

    const isEmployee = await prisma.employee.findFirst({
      where: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        age: data.age
      }
    })

    if (isEmployee) {
      return res.status(400).json({message: 'An employee with such data exists'})
    }
		
    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id
      }
    })

    return res.status(200).json(employee)
	} catch {
		res.status(500).json({message: 'Error add employee'})
	}
}

const remove = async (req, res) => {
	try {
    const {id} = req.params

    await prisma.employee.delete({
      where: {
        id
      }
    })

    res.status(204).json({message: 'OK'})
    
	} catch {
		res.status(500).json({ message: 'Error DELETE employees' })
	}
}

const edit = async (req, res) => {
	try {
    const data = req.body
    const {id} = req.params

    await prisma.employee.update({
      where: {
        id,
      },
      data
    })
    
    res.status(204).json('OK')
	} catch {
		res.status(500).json({ message: 'Error EDIT employees' })
	}
}

const employee = async (req, res) => {
  
  try {
    const {id} = req.params

    const employee = await prisma.employee.findUnique({
			where: {
        id
			},
		})
    
    res.status(200).json(employee)
  } catch {
		res.status(500).json({ message: 'Not search employee' })
  }
} 

module.exports = {
  all, 
  add, 
  remove, 
  edit, 
  employee
}