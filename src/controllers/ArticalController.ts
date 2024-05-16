import { Request, Response, NextFunction } from "express";

class ArticleController {
  getArticlesPage(request: Request, response: Response, next: NextFunction) {
    response.type("text/plain");
    response.send("All articles are here!");
  }
}

export default ArticleController;
