import mongoose, { Schema } from "mongoose";



// Define the schema for a status update
const statusSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'video'],
    required: true
  },
  textContent: {
    type: String,
    required: function() {
      return this.contentType === 'text';
    }
  },
  mediaUrl: {
    type: String,
    required: function() {
      return this.contentType === 'image' || this.contentType === 'video';
    }
  },
  likes:[{
    type: Schema.ObjectId,
    ref: "User",
  }],
  views:[{
    type: Schema.ObjectId,
    ref: "User",
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {timestamps:true});


const Status = mongoose.model('Status', statusSchema);

export default Status;
