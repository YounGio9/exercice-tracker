const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(bodyParser())
app.use(express.static('public'))

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('connected to MongoDB')
  } catch (error) {
    console.error(error)
  }
}
connect()

const exerciseSchema = mongoose.Schema({
  username: String,
  user_id: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {
    type: Date,
    required: true
  },
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
})

const User = mongoose.model('User', userSchema)

const logSchema = mongoose.Schema({
  username: {type: String, required: true},
  user_id: {type: String, required: true},
  count: {type: Number, required: true},
  log: [{
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date, required: true}
  }]
})

const Log = mongoose.model('Log', logSchema)


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users/:id/logs', async (req, res) => {
  const {id} = req.params
  try {
    const userLog = await Log.findOne({user_id: id})
    const {username, count} = userLog
    res.status(200).json({
      _id: userLog.user_id,
      username,
      count,
      log: userLog.log.map(log => {
        return {
          description: log.description,
          duration: log.duration,
          date: log.date
        } 
      })

    })
  } catch (error) {
    console.error(error.message)
  }
})

app.post('/api/users', async (req,res) => {

  const {username} = req.body
    try {
      const user = await User.create({username: username})
      user.save()
      res.status(201).json({
        username: user.username,
        _id: user._id
      })
    } catch (error) {
      return console.error(error.message)
    }
})

app.get('/api/users', async (req, res) => {
  let users 
  try {
     users = await User.find()
  } catch (error) {
    return console.error(error.message)
  }
  res.status(200).json(users)
})

app.post('/api/users/:_id/exercises',async (req,res) => {
  const {id} = req.params
  const {_id, description, duration, date} = req.body
  const d = date === '' ? Date.now() : new Date(date)

  try {
    const user = await User.findById({_id: _id}).select({__v: 0})
     const exercise = await Exercise.create({
      username: user.username,
      description: description, 
      duration: duration,
      user_id: _id,
      date: d
    })
    exercise.save()
    const log = await Log.findOne({user_id: _id})
    if(log) {
      log.count = log.count + 1
      log.log.push({
        description: description,
        date: d,
        duration: duration
      })
      log.save()
    } 
    else {
      await Log.create({
        username: user.username,
        user_id: _id,
        count: 1,
        log: [
          {
            description: description,
            duration: duration,
            date: d
          }
        ]
      })
      console.log('Log not exist then created')
    }
    res.status(201).send({
      ...user._doc,
      date: exercise.date.toDateString(),
      duration: exercise.duration,
      description: exercise.description
    })
  } catch (error) {
    console.error(error.message)
  }
  
})







const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
