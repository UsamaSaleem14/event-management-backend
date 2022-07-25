// Model
const EventModel = require("../../models/event")
const UserModel = require("../../models/user")
const BookingModel = require("../../models/bookings")

const { transformedBookings, transformedEvent } = require("./merge")

module.exports = {
  bookings: async () => {
    try {
      const allBookings = await BookingModel.find()
      return allBookings.map((booking) => {
        return transformedBookings(booking)
      })
    } catch (err) {
      throw err
    }
  },
  bookEvent: async (args) => {
    try {
      const myEvent = await EventModel.findOne({ _id: args.eventId })
      const myUser = await UserModel.findOne({ email: "test@test.com" })
      const bookingModel = new BookingModel({
        event: myEvent,
        user: myUser,
      })

      const result = await bookingModel.save()
      return transformedBookings(result)
    } catch (err) {
      throw err
    }
  },
  cancelBooking: async (args) => {
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
