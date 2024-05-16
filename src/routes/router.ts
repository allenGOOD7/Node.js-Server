import ArticleRoute from './article.route'
import AuthRoute from './auth.route'

import type Route from './route'

export const router: Array<Route> = [new AuthRoute(), new ArticleRoute()]
