//Express
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();

// create an instance of express
const app=express();
app.use(express.json());
app.use(cors());

//Sample in-memory storage for todo items
// let todos=[];

//connecting mongodb
// const username = 'root'; // Replace with your MongoDB username
// const password = encodeURIComponent('9047733109Suri'); // Replace with your MongoDB password
// const cluster = 'cluster0.v4p4pb1.mongodb.net'; // Replace with your cluster address
// const dbName = 'mern-app'; // Replace with your database name
const mongoUri = process.env.MONGO_DB_URI; 

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));
// Create schema
const todoSchema =new mongoose.Schema({
    title:{
       type:String,
       required:true
    },
    description:String
})

// Creating model
const todoModel=mongoose.model('Todo',todoSchema);

//Create a new todo item
app.post('/todos',async(req,res)=>{
   const {title,description}= req.body;
//    const newTodo={
//      id:todos.length+1,
//      title,
//      description
//    };
//    todos.push(newTodo);
//    console.log(todos);

  
   try {
    const newTodo =new todoModel({title,description});
    await newTodo.save();
    res.status(201).json(newTodo);
    
   } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message});
   }
   
})

//Get All items
app.get('/todos',async(req,res)=>{
    try {
        const todos=await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

//update todo item

app.put('/todos/:id',async (req,res)=>{
    try {
        const {title,description}= req.body;
        const id=req.params.id;
        const updatedTodo=await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true}
    )
    if (!updatedTodo) {
        return res.status(404).json({message:"Todo not found"});
    }
    res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }

})

//Delete todo item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})



app.listen(8000,()=>{
    console.log('server is running port 8000....');
})