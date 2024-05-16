import { Request, Response, NextFunction } from "express";

class AuthController {
  echo(request: Request, response: Response, next: NextFunction) {
    response.type("text/plain");
    response.send("echo");
  }
}

export default AuthController;
