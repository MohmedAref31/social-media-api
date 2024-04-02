import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'public/assets/')
    },
    filename: (req, file, cb)=>{
        const uniquePostfix = `${Date.now()}-${(Math.random() * 100).toString(32)} `
        cb(null, `${uniquePostfix}-${file.originalname}`);
    },
})

const upload = multer({storage})


export default upload;