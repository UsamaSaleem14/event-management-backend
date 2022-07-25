const usersResolver = require("./users")
const eventsResolver = require("./events")
const bookingsResolver = require("./bookings")

const rootResolver = {
  ...usersResolver,
  ...eventsResolver,
  ...bookingsResolver,
}

module.exports = rootResolver
