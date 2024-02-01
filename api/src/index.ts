import { Elysia } from "elysia";
import { createNote, getAllNotes } from "./routes/notes";
import * as surrealdb from "./db/surrealdb";
import cors from "@elysiajs/cors";


// Init DB
await surrealdb.init()

const app = new Elysia()
  .use(cors())
  .post("/mynotes", getAllNotes)
  .post("/notes", createNote)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
