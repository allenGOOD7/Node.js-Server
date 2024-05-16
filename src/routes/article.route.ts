import Route from './route'
import ArticalController from '../controllers/ArticalController'

class ArticleRoute extends Route {
  private articalController = new ArticalController()

  constructor() {
    super()
    this.prefix = '/articles'
    this.setRoutes()
  }

  protected setRoutes() {
    this.router.get('/articles', this.articalController.getArticlesPage)
  }
}

export default ArticleRoute
