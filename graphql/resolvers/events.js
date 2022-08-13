// Model
const EventModel = require("../../models/event")
const UserModel = require("../../models/user")

// Helpers
const { todayDate } = require("../../helpers/date")

const { transformedEvent } = require("./merge")

module.exports = {
  events: async () => {
    const events = await EventModel.find()
    try {
      return events.map((event) => {
        return transformedEvent(event)
      })
    } catch (err) {
      throw err
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated")
    }
    const eventModel = new EventModel({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: todayDate(),
      creator: req.userId,
    })

    let createdEvent
    try {
      const result = await eventModel.save()
      createdEvent = transformedEvent(result)

      const creator = await UserModel.findById(req.userId)

      if (!creator) {
        throw new Error("User not found")
      }
      creator.createdEvents.push(eventModel)
      await creator.save()

      return createdEvent
    } catch (err) {
      throw err
    }
  },
}
