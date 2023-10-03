const bcrypt = require("bcryptjs")

async function temp(){

    hashedPassword = await bcrypt.hash("12345678", 12);
    console.log(hashedPassword)
}

temp()