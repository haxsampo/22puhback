const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.ATLAS_PASS
/* `mongodb+srv://fullstack:${password}@cluster22.tfkvv.mongodb.net/puhback?retryWrites=true&w=majority
` */
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to mongodb')
    })
    .catch((error) => {
        console.log('error connecting to mongodb: ', error.message)
    })

const puhSchema = new mongoose.Schema({
    name: String,
    number: String,
    _id: Number
})

puhSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        if ('_id' in returnedObject) {
            returnedObject.id = returnedObject._id.toString()
        }
        delete returnedObject._id
        delete returnedObject.__v
    }
})



/* let l = []
Person.find({}).then(res => { 
    res.forEach(prs => {
        l = l.concat(prs)
    })
    mongoose.connection.close()
    return l
})
 */
module.exports = mongoose.model('Person', puhSchema)