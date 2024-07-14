import {Schema, model} from "mongoose";


const notificationSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    message:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
    }
})


const Notification = model("Notification", notificationSchema)

export default Notification