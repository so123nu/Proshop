import bcrypt from 'bcryptjs';

const users = [
    {
        name: "Admin",
        email: "admin@yopmail.com",
        password: bcrypt.hashSync('qwerty123', 10),
        isAdmin: true

    },
    {
        name: "Surya Sah",
        email: "surya@yopmail.com",
        password: bcrypt.hashSync('qwerty123', 10),

    },
    {
        name: "Sam Sharma",
        email: "sam@yopmail.com",
        password: bcrypt.hashSync('qwerty123', 10),

    }
]

export default users;