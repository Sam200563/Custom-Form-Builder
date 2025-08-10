import mongoose from "mongoose";

const reponseSchema = new mongoose.Schema({
    formId:{type:mongoose.Schema.Types.ObjectId, ref:'Form' , required:true},
    answers:[
        {
            questionId:mongoose.Schema.Types.ObjectId,
            answer:mongoose.Schema.Types.Mixed
        }
    ]
},{timestamps:true});

export default mongoose.model('Response',reponseSchema)