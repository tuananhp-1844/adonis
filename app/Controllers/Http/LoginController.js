'use strict'

const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('google').redirect()
  }

  async callback ({ ally, auth, response }) {
    try {
      const ggUser = await ally.driver('google').getUser()

      // user details to be saved
      const userDetails = {
        email: ggUser.getEmail(),
        username: ggUser.getEmail(),
        password: 'aaa',
      }

      // search for existing user
      const whereClause = {
        email: ggUser.getEmail()
      }

      const user = await User.findOrCreate(whereClause, userDetails)
      await auth.login(user)

      response.redirect('/')
    } catch (error) {
      console.log(error)
      return 'Unable to authenticate. Try again later'
    }
  }
}

module.exports = LoginController
