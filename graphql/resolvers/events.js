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
  createEvent: async (args) => {
    const eventModel = new EventModel({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: todayDate,
      creator: "62ae10c5f29078e76aa3a6c5",
    })

    let createdEvent
    try {
      const result = await eventModel.save()
      createdEvent = transformedEvent(result)

      const creator = await UserModel.findById("62ae10c5f29078e76aa3a6c5")

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
