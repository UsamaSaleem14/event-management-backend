const EventModel = require("../../models/event")
const UserModel = require("../../models/user")

// Helpers
const { dateToString } = require("../../helpers/date")

const transformedEvent = (event) => {
  return {
    ...event._doc,
    creator: userObject.bind(this, event._doc.creator),
    date: dateToString(event._doc.date),
  }
}

const transformedBookings = (booking) => {
  return {
    ...booking._doc,
    user: userObject.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
}

const transformedUser = (user) => {
  return {
    ...user._doc,
    createdEvents: events.bind(this, user._doc.createdEvents),
  }
}

const userObject = async (userId) => {
  try {
    const creator = await UserModel.findById(userId)
    return {
      ...creator._doc,
      createdEvents: events.bind(this, creator._doc.createdEvents),
    }
  } catch (err) {
    throw err
  }
}

const events = async (eventIds) => {
  try {
    const events = await EventModel.find({ _id: { $in: eventIds } })
    return events.map((event) => {
      return transformedEvent(event)
    })
  } catch (err) {
    throw err
  }
}

const singleEvent = async (id) => {
  try {
    const event = await EventModel.findById(id)
    return transformedEvent(event)
  } catch (err) {
    throw err
  }
}

exports.transformedEvent = transformedEvent
exports.transformedBookings = transformedBookings
exports.transformedUser = transformedUser
