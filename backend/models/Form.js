import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    type:{type:String,enum:['categorize','cloze','comprehension'],required:true},
    questionText:String,
    imageUrl: String,
    options:[String],
    categories:[String],
    paragraph:String,
    blanks:[String],
    answers:[String],
    subQuestions: [            
    {
      question: String,
      answer: String,
    }
  ],
});

const formSchema = new mongoose.Schema({
    title:String,
    headerImage:String,
    questions:[questionSchema],
},{timestamps:true})

export default mongoose.model('Form',formSchema);