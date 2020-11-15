const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://admin-zvika:5293612aA!@cluster0.hdltc.mongodb.net/patients'

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
const connection = mongoose.connection;
connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
  });

const patientSchema = new mongoose.Schema({
    PatientID: String,
    q1: String,
    q2: String,
    q3: String,
    q4: String,
    q5: String,
    q6: String,
    
})

const Patient = mongoose.model("Patient", patientSchema)


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '/public/views'))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname })
});

app.get('/dr', (req, res) => {
    res.sendFile('public/dr.html', { root: __dirname })
});

app.post('/send', (req, res) => {
    var patient=new Patient({
        PatientID:req.body.PatientID,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4,
        q5: req.body.q5,
        q6: req.body.q6
        
    })
    patient.save()
    console.log(patient)
    res.redirect('/')
});

app.post('/dr', (req, res) => {
   
    Patient.findOne({PatientID: req.body.PatientID}, (err,patient) =>{
        
        try{
        console.log(patient)
        res.render('dr',{id: patient.PatientID,
            q1: patient.q1,
            q2:patient.q2,
            q3: patient.q3,
            q4: patient.q4,
            q5: patient.q5,
            q6: patient.q6});
        }catch(error){
            res.render('dr',{id: 'לא נמצא מידע',
                q1: 'לא נמצא מידע',
                q2:'לא נמצא מידע',
                q3: 'לא נמצא מידע',
                q4: 'לא נמצא מידע',
                q5: 'לא נמצא מידע',
                q6: 'לא נמצא מידע'});


        }
    });
      
    
});


app.listen(port, () => console.log(`Listening on port ${port}...`));