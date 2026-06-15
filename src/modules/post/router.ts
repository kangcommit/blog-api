import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createPostSchema, updatePostSchema } from "./schema.js";

export const postRouter = new Hono();

postRouter
	.get("/", (c) => c.json({ message: "get all posts" }))
	.post("/", zValidator("json", createPostSchema), async (c) =>
		c.json({ message: "create post" }),
	)
	.get("/:id", (c) => c.json({ message: "get post by id" }))
	.patch("/:id", zValidator("json", updatePostSchema), async (c) =>
		c.json({ message: "update post" }),
	)
	.delete("/:id", (c) => c.json({ message: "delete post" }));
