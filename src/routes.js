const express = require('express')
const multerConfig = require('./config/multer')
const uplaod = require('multer')(multerConfig)

const routes = express.Router()

const authMiddleware = require('./app/middleware/auth')
const guestMiddleware = require('./app/middleware/guest')

const UserController = require('./app/controller/UserController')
const SessionController = require('./app/controller/SessionController')
const DashboardController = require('./app/controller/DashboardController')
const FileController = require('./app/controller/FileController')
const AppointmentController = require('./app/controller/AppointmentController')
const AvailableController = require('./app/controller/AvailableController')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.get('/files/:file', FileController.show)

routes.get('/', guestMiddleware, SessionController.create)
routes.post('/signin', SessionController.store)

routes.get('/signup', guestMiddleware, UserController.create)
routes.post('/signup', uplaod.single('avatar'), UserController.store)

routes.get('/app/dashboard', DashboardController.index)

routes.get('/app/appointments/new/:provider', AppointmentController.create)
routes.post('/app/appointments/new/:provider', AppointmentController.store)

routes.get('/app/available/:provider', AvailableController.index)


// routes.get('/app/dashboard', (req, res) => res.render('dashboard'))

routes.use('/app', authMiddleware)

routes.get('/app/logout', SessionController.destroy)
routes.get('/app/dashboard', (req, res) => {
  console.log(req.session.user)
  return res.render('dashboard')
})

module.exports = routes
