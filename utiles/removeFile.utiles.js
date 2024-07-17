import {unlink} from "fs"
 const  removeFiles = (...filePaths)=>{
    filePaths.forEach(filePath=>{
        unlink("public"+filePath, (err)=>{
        if(err) return console.log("failed to remove file " + filePath)  
        console.log("removed file " + filePath)
    })
    })
    
}
export default removeFiles