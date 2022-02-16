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

app.post('/api/persons', (req, res, next) => {
  /* const body = req.body
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
  }) */
  const prs = new Person({
    name: body.name,
    number: body.number,
    _id: Math.floor(Math.random()*1000)
  })
  prs.save().then(saved => {
    res.json(saved)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
      .catch(error => next(error))
    /* const id = Number(req.params.id)
    persons = persons.filter(prs => prs.id !== id)
    res.status(204).end() */
})

app.get('/api/persons', (req, res, next)=> {
  l = []
  Person.find({}).then(ppl => {
    res.json(ppl)
  }).catch(error => next(error))
})

app.get('/info', (req, res, next)=> {
  let t = new Date()
  let dt = t.toDateString()+" "+t.toLocaleTimeString()
  Person.find({}).then(ppl => {
    res.send(`<p>Phonebook has ${ppl.length} people</p>`+JSON.stringify(dt))
  }).catch(error => next(error))
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
  if (error.name == 'ReferenceError') {
    return res.status(400).send({error:'name undefined'})
  }
  next(error)
}
app.use(errorHandler)