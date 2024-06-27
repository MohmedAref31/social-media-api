import {unlink} from "fs"
 const  removeFile = (filePath)=>{
    unlink(filePath, (err)=>{
        if(err) return console.log("failed to remove file " + filePath)  
        console.log("removed file " + filePath)
    })
}
export default removeFile