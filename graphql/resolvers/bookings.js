// Model
const EventModel = require("../../models/event")
const UserModel = require("../../models/user")
const BookingModel = require("../../models/bookings")

const { transformedBookings, transformedEvent } = require("./merge")

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated")
    }
    try {
      const allBookings = await BookingModel.find()
      return allBookings.map((booking) => {
        return transformedBookings(booking)
      })
    } catch (err) {
      throw err
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated")
    }
    try {
      const myEvent = await EventModel.findOne({ _id: args.eventId })
      const bookingModel = new BookingModel({
        event: myEvent,
        user: req.userId,
      })

      const result = await bookingModel.save()
      return transformedBookings(result)
    } catch (err) {
      throw err
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated")
    }
    try {
      const booking = await BookingModel.findById(args.bookingId).populate("event")
      const myEvent = transformedEvent(booking.event)
      await BookingModel.deleteOne({ _id: args.bookingId })
      return myEvent
    } catch (err) {
      throw err
    }
  },
}
