import Route from "./route";
import AuthRoute from "./auth.route";
import ArticleRoute from "./article.route";

export const router: Array<Route> = [new AuthRoute(), new ArticleRoute()];
