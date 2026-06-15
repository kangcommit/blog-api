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
	.get("/search", async (c) => {
		const query = c.req.query("q");

		if (!query || query.trim() === "") {
			return c.json({ message: "Search query is required" }, 400);
		}

		const posts = await prisma.post.findMany({
			where: {
				OR: [{ title: { contains: query } }, { content: { contains: query } }],
			},
		});

		return c.json({ data: posts });
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
	.post("/", zValidator("json", createPostSchema), async (c) => {
		const body = c.req.valid("json");

		const newPost = await prisma.post.create({ data: body });

		return c.json({ message: "Post Added successfully", data: newPost }, 201);
	})
	.post("/:id/publish", async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ message: "Invalid post ID" }, 400);
		}

		try {
			const updatedJob = await prisma.post.update({
				where: { id },
				data: {
					status: "published",
				},
			});

			return c.json({
				message: "Post Published successfully",
				data: updatedJob,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ message: "Post not found" }, 404);
				}
			}
			throw error;
		}
	})
	.post("/:id/unpublish", async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ message: "Invalid post ID" }, 400);
		}

		try {
			const updatedJob = await prisma.post.update({
				where: { id },
				data: {
					status: "draft",
				},
			});

			return c.json({ message: "Post unpublished", data: updatedJob });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ message: "Post not found" }, 404);
				}
			}
			throw error;
		}
	})
	.post("/:id/archive", async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ message: "Invalid post ID" }, 400);
		}

		try {
			const updatedJob = await prisma.post.update({
				where: { id },
				data: {
					status: "archived",
				},
			});

			return c.json({
				message: "Post archived successfully",
				data: updatedJob,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ message: "Post not found" }, 404);
				}
			}
			throw error;
		}
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
