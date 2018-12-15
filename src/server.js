const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const SERVER_PORT = 8081

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oahqmiv3vNztGsZN0h7',
  issuer: 'https://dev-127892.oktapreview.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next)
})

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite',
  operatorsAliases: false
})

/*
 * A model representing a disposed item. These have some basic fields about the
 * item.
 */
const DisposedItem = database.define('disposedItem', {
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    // Length 10, decimals 5
    currentWeightRecorded: Sequelize.DOUBLE(10, 5),
    facility: Sequelize.STRING,
    company: Sequelize.STRING
})

/*
 * The category a disposed item belongs to. It just has a name fiedl for now
 * to keep things simple. Later other fields, like who created it, the
 * company/facility name, and other fields can be added.
 *
 * A many-to-many relationship is defined between the DisposedItem and
 * DisposedItemCategory. This will allow a user to add an item to multiple
 * categories, and categoried to multiple items.
 */
const DisposedItemCategory = database.define('disposedItemCategory', {
    name: Sequelize.STRING
})

/*
 * A model for the many-to-many relationship between the DisposedItem and
 * DisposedItemCategory.
 */
 DisposedItem.belongsToMany(DisposedItemCategory, {
     through: 'DisposedItemCategoryConnection'
 })
 DisposedItemCategory.belongsToMany(DisposedItem, {
     through: 'DisposedItemCategoryConnection'
 })


epilogue.initialize({
  app: app,
  sequelize: database
})

const disposedItemResource = epilogue.resource({
    model: DisposedItem,
    endpoints: ['/disposed-items/', '/disposed-items/:id'],
    // only items that have the specified category ID
    /*search: {
        param: 'whereCategoryIs',
        attributes: ['disposedItemCategoryId']
    }*/
})

const disposedItemCategory = epilogue.resource({
    model: DisposedItemCategory,
    endpoints: ['/disposed-item-category/', '/disposed-item-category/:id']
})

// Resets the database and launches the express app on :8081
database
  .sync({ force: true })
  .then(() => {
    app.listen(SERVER_PORT, () => {
      console.log(`listening to port localhost:${SERVER_PORT}`)
    })
  })
