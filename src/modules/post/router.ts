import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Prisma } from "../../generated/prisma/client.js";
import { parseId } from "../../utils/params.js";
import { prisma } from "../../utils/prisma.js";
import { createPostSchema, updatePostSchema } from "./schema.js";

export const postRouter = new Hono();

postRouter
	.get("/", async (c) => {
		const posts = await prisma.post.findMany();
		return c.json({ data: posts });
	})
	.post("/", zValidator("json", createPostSchema), async (c) => {
		const body = c.req.valid("json");

		const newPost = await prisma.post.create({ data: body });

		return c.json({ message: "Post Added successfully", data: newPost }, 201);
	})
	.get("/:id", async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ message: "Invalid post ID" }, 400);
		}

		const post = await prisma.post.findUnique({
			where: { id },
		});

		if (!post) {
			return c.json({ message: "Post not found" }, 404);
		}

		return c.json({ data: post });
	})
	.patch("/:id", zValidator("json", updatePostSchema), async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ message: "Invalid post ID" }, 400);
		}

		const body = c.req.valid("json");

		try {
			const updatePost = await prisma.post.update({
				where: { id },
				data: body,
			});

			return c.json({ message: "Post updated", data: updatePost });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ message: "Post not found" }, 404);
				}
			}
			throw error;
		}
	})
	.delete("/:id", async (c) => {
		const id = Number(c.req.param("id"));

		if (Number.isNaN(id)) {
			return c.json({ message: "Invalid post ID" }, 400);
		}

		try {
			await prisma.post.delete({
				where: { id },
			});

			return c.json({ message: "Post deleted successfully", data: null });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ message: "Post not found" }, 404);
				}
			}
			throw error;
		}
	});
