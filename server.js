const mongose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException',err=>{
  console.log('UNHANDLED EXCEPTION. SHUTTING DOWN........!')
  console.log(err.name ,err.message);
  process.exit(1)
})

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
  // process.env.FAKE_PASSWORD
);

mongose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(() =>console.log('DB connection successfull'));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection',err=>{

  console.log('UNHANDLED REJECTION. SHUTTING DOWN........!')
  console.log(err.name ,err.message);
  server.close(()=>{
    process.exit(1)
  })

});
