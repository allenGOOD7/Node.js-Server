import Route from './route'
import AuthController from '../controllers/AuthController'

class AuthRoute extends Route {
  private authController = new AuthController()

  constructor() {
    super()
    this.prefix = '/auth'
    this.setRoutes()
  }

  protected setRoutes() {
    this.router.get('/login', this.authController.echo)
  }
}

export default AuthRoute
