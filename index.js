require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())
const cors = require('cors')
const Person = require('./models/db_connection')
app.use(cors())


morgan.token('nimi', function (req) { return  JSON.stringify(req.body.name)})
morgan.token('nro', function (req) { return JSON.stringify(req.body.number)})

app.use(morgan(':method :url :status :response-time ms Nimi\: :nimi nro\: :nro'))

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
  const body = req.body
  const prs = new Person({
    name: body.name,
    number: body.number,
    _id: Math.floor(Math.random()*1000)
  })
  //error = prs.validateSync();
  //console.log(error.errors['number'].message)
  prs.save().then(saved => {
    res.json(saved)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next)=> {
  Person.find({}).then(ppl => {
    res.json(ppl)
  }).catch(error => next(error))
})

app.get('/info', (req, res, next)=> {
  let t = new Date()
  let dt = t.toDateString()+' '+t.toLocaleTimeString()
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

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({error:'malformatted id'})
  }
  if (error.name === 'ReferenceError') {
    return res.status(400).send({error:'name undefined'})
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)