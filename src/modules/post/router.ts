import { Hono } from "hono";

export const postRouter = new Hono();

postRouter
	.get("/", (c) => c.json({ message: "get all posts" }))
	.post("/", (c) => c.json({ message: "create post" }))
	.get("/:id", (c) => c.json({ message: "get post by id" }))
	.put("/:id", (c) => c.json({ message: "update post" }))
	.patch("/:id", (c) => c.json({ message: "partial update post" }))
	.delete("/:id", (c) => c.json({ message: "delete post" }));
