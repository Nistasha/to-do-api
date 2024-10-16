const express= require('express');

const app= express();
const port= 3000;

//Middleware to parse JSON
app.use(express.json());

//In-memory array to store tasks
let tasks=[];
let nextId = 1; //To assign unique Id to tasks

//Create a new task
app.post('/tasks', (req,res)=>{
    const {task} = req.body;
    if(!task || typeof task !== 'string' || task.trim()==='')
    {
        return res.status(400).json({
            error: 'Task description is required and must be an non empty string'
        })

    }
    const newTask = {id: nextId++, task};
    tasks.push(newTask);
    res.status(201).json(newTask);
})

//Get all tasks
app.get('/tasks', (req,res)=>{
    res.json(tasks);
});

//Update a task
app.put('/tasks/:id', (req,res)=> {
    const taskId = parseInt(req.params.id, 10);
    const {task}= req.body;

    const taskToUpdate = tasks.find(t=> t.id === taskId);
    if(!taskToUpdate){
        return res.status(404).json({
            error: 'task not foundd'
        })
    }

    if (!task || typeof task !== 'string' || task.trim()===''){
        return res.status(400).json({
            error:'Task description is required and must be an non empty string '
        })
    }
    taskToUpdate.task= task;
    res.json(taskToUpdate);
}) 

//Delete a task
app.delete('/tasks/:id', (req,res)=> {
    const taskId = parseInt(req.params.id, 10);
    const index= tasks.findIndex(t => t.id === taskId);
    if(index === -1){
        return res.status(404).json({
             error: 'Task not found.'
        })
    }
    tasks.splice(index, 1);
    res.status(204).send();

});

//start the server
app.listen(port, ()=>{
    console.log(`Server is running at ${port}`)
});