import bcrypt = require('bcrypt')
import { diskStorage } from 'multer';
const saltRounds = 10;


export const hashPasswordHelpers = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.log(error);
    }
}

export const comparePasswordHelper = async (plainPassword: string, hasPassword: string) => {
    try {
        return await bcrypt.compare(plainPassword, hasPassword);
    } catch (error){
        console.log(error);
    }
}


export const storeConfig = (folder: string) => diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})