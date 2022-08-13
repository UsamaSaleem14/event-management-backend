const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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
  login: async ({ email, password }) => {
    const user = await UserModel.findOne({ email: email })
    if (!user) {
      throw new Error(`User ${email} not found`)
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error(`Password is incorrect!`)
    }
    // somesupersecretkey should be replaced with a valid key that will help in validating the token
    const token = await jwt.sign({ userId: user.id, email: user.email }, "somesupersecretkey", { expiresIn: "1h" })

    return { userId: user.id, token: token, tokenExpiration: 1 }
  },
  changePassowrd: async ({ email, password }, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated")
    }
    const user = await UserModel.findOne({ email: email })
    if (!user) {
      throw new Error(`User ${email} not found`)
    }
    const encryptedPassword = await bcrypt.hash(password, 12)
    UserModel.updateOne({ id: user.id }, { $set: { password: encryptedPassword } })
    return password
  },
}
