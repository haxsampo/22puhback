require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())
const cors = require('cors')
const Person = require('./models/db_connection')
app.use(cors())


morgan.token('nimi', function (req, res) { return  JSON.stringify(req.body.name)})
morgan.token('nro', function (req, res) { return JSON.stringify(req.body.number)})

app.use(morgan(':method :url :status :response-time ms Nimi\: :nimi nro\: :nro'))
//--------
const mongoose = require('mongoose')
//var password = process.argv[2]
//const url = `mongodb+srv://fullstack:${password}@cluster22.tfkvv.mongodb.net/puhback?retryWrites=true&w=majority`

/* mongoose.connect(process.env.ATLAS_PASS)
const puhSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', puhSchema) */


/* var l = []
let persons = Person.find({}).then(res => {
    res.forEach(prs => {
        console.log(prs)
        l = l.concat(prs)
    })
    mongoose.connection.close()
}) */

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
  .then(prs => {
    if(prs) {
      res.json(prs)
    } else {
      res.status(404).end()
    } 
  })
  .catch(error =>
    next(error))
})

app.post('/api/persons', (req, res) => {
  /* Person.find({}).then(prs => {
    res.json(prs)
  }) */
  const body = req.body
  if(body.name === undefined) {
    return res.status(400).json({error:"undefined content"})
  }
  const prs = new Person({
    name: body.name,
    number: body.number,
    _id: Math.floor(Math.random()*1000)
  })
  prs.save().then(saved => {
    res.json(saved)
  })
  /* if(persons.map(person => person.name).includes(prs.name)) {
    res.status(400).send({ error: 'name must be unique' })
  } else {
    persons = persons.concat(prs)
    res.json(prs)
  } */
})

app.delete('/api/persons/:id', (req, res, error) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
      .catch(error => next(error))
    /* const id = Number(req.params.id)
    persons = persons.filter(prs => prs.id !== id)
    res.status(204).end() */
})

app.get('/api/persons', (req, res)=> {
  l = []
  Person.find({}).then(ppl => {
    res.json(ppl)
  })
})

app.get('/info', (req, res)=> {
    let t = new Date()
    let dt = t.toDateString()+" "+t.toLocaleTimeString()
    res.send(`<p>Phonebook has ${persons.length} people</p>`+JSON.stringify(dt))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, res, next) => {
  console.error(error.message)
  if (error.name == 'CastError') {
    return res.status(400).send({error:'malformatted _id'})
  }
  next(error)
}
app.use(errorHandler)