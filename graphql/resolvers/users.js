const bcrypt = require("bcryptjs")

// Model
const UserModel = require("../../models/user")

const { transformedUser } = require("./merge")

module.exports = {
  users: async () => {
    const allUsers = await UserModel.find()
    try {
      return allUsers.map((singleUser) => {
        return transformedUser(singleUser)
      })
    } catch (err) {
      throw err
    }
  },

  createUser: async (args) => {
    try {
      const creator = await UserModel.findOne({ email: args.userInput.email })
      if (creator) {
        throw new Error("User already exists")
      }

      const encryptedPassword = await bcrypt.hash(args.userInput.password, 12)

      const userModel = new UserModel({
        email: args.userInput.email,
        password: encryptedPassword,
      })

      const savedUser = await userModel.save()

      return { ...savedUser._doc, password: null, _id: savedUser.id }
    } catch (err) {
      throw err
    }
  },
}
