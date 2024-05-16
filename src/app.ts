import { createServer, IncomingMessage, ServerResponse } from "http";
import "dotenv/config";

const port = process.env.PORT;

const server = createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    const { headers, method, url } = request;
    let body: any = [];
    request
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        console.log(body);
        console.log(request.headers);
        console.log(request.headers.authorization);
        console.log("success");
      });
    response.on("error", (err) => {
      console.error(err);
    });
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello world!");
  }
);

server.listen(port);
console.log(`server is running on http://localhost:${port}`);
