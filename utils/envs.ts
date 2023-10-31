import env from "dotenv";

env.config();

export const envs = {
  Port: parseInt(process.env.PORT!),
};
