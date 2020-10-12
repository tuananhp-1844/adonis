'use strict'

class WebInitController {
  async index({auth}) {
    const user = await auth.getUser()
    return user
  }
}

module.exports = WebInitController
