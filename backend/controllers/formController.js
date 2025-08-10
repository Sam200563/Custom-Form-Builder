import Form from "../models/Form.js";
import Response from "../models/Response.js";

export const createform = async(req,res)=>{
    try {
        const newForm = new Form(req.body);
        const savedFrom = await newForm.save()
        res.status(201).json(savedFrom)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
};

export const getallForms = async(req,res)=>{
    try {
        const forms = await Form.find();
        res.json(forms)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

export const getFormById = async(req,res)=>{
    try {
        const form = await Form.findById(req.params.id);
        if(!form){
            return res.status(404).json({success:false , message:'Form not found'});
        }
        res.json(form)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

export const updateForm = async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const submitResponse = async (req,res)=>{
    try {
        const newResponse =new Response({
            formId:req.params.id,
            answers:req.body.answers,
        });
        const savedResponse = await newResponse.save();
        res.status(201).json(savedResponse)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}