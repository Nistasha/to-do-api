const express= require('express');

const app= express();
const port= 3000;

//Middleware to parse JSON
app.use(express.json());

//In-memory array to store tasks
let tasks=[];
let nextId = 1; //To assign unique Id to tasks

//hardcoded username and password for simplicity
const USERNAME = 'admin';
const PASSWORD = 'password';

//Middleware to implement Basic AUthentication
const basicAuth = (req, res, next)=> {
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        //if no AUthorisation header is present, return 401
        return res.status(401).json({error: 'Authorization header is required'}
         
        )
    }

    //The format of the authorization header shuld be 'Basic
    const base64Credentials = authHeader.split('')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check if the provided username and password match the hardcoded values
    if (username === USERNAME && password === PASSWORD) {
        next(); // Authentication successful, proceed to the next middleware
    } else {
        // If authentication fails, return 401 Unauthorized
        return res.status(401).json({ error: 'Invalid credentials' });
    }
};

//Create a new task
app.post('/tasks',basicAuth, (req,res)=>{
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

//Get all tasks with pagination
app.get('/tasks', (req,res)=>{
    const {offset =0, limt=10}= req.query;

    //Convert query parametrs to integers
    const offsetInt = parseInt(offset, 10);
    const limitInt= parseInt(limit, 10);

    //Validate offset and limit
    if(isNaN(offsetInt)|| offsetInt < 0){
        return res.status(400).json({error: 'Offset must be ..'})
    }
    if(isNaN(limitInt)|| limitInt <= 0){
        return res.status(400).json({error:'Limit must be a posi....'})
    }

    //Slice teh tasks array for pagination
    const paginatedTasks = tasks.slice(offsetInt, offsetInt + limitInt)
    res.json(paginatedTasks);
});

//Update a task
app.put('/tasks/:id', basicAuth, (req,res)=> {
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
app.delete('/tasks/:id',basicAuth, (req,res)=> {
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