require('dotenv').config({path:'backend/config/.env'});
const app = require('./app');
const PORT = process.env.PORT || 3000;
const MODE = process.env.NODE_ENV 

//Handle Uncaught exceptions

process.on('uncaughtException',err=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down server due to uncaught exceptions');
    process.exit(1);
})
const server = app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT} in ${MODE}`)
})

//Handle uncaught promise rejection

process.on('uncaughtException',err=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to an unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    })
})