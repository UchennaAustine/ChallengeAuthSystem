import express, { Application } from "express";
import { myApplication } from "./application";
import { envs } from "./utils/envs";

process.on("uncaughtException", (error: Error) => {
  console.log(`Error due to uncaughtException: ${error}`);

  process.exit(1);
});

const Port: number = envs.Port;

const application: Application = express();

myApplication(application);

const myServer = application.listen(Port, () => {
  console.log(" ");
  console.log(`Active:`, Port);
});

process.on("uncaughtException", (error: Error) => {
  console.log(`Error due to uncaughtException: ${error}`);

  myServer.close(() => {
    process.exit(1);
  });
});
