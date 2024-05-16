import ArticalController from "../controllers/ArticalController";
import Route from "./route";

class ArticleRoute extends Route {
  private articalController = new ArticalController();

  constructor() {
    super();
    this.prefix = "/articles";
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get("/articles", this.articalController.getArticlesPage);
  }
}

export default ArticleRoute;
