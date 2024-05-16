import { Request, Response, NextFunction } from "express";

export class ApiControllers {
  getHomePage(request: Request, response: Response, next: NextFunction) {
    response.type("text/plain");
    response.send("Homepage");
  }

  getAboutPage(request: Request, response: Response, next: NextFunction) {
    response.type("text/plain");
    response.send("My name is Allen.");
  }
}
