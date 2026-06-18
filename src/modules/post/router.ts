import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Prisma } from "../../generated/prisma/client";
import { parseId } from "../../utils/params.js";
import { prisma } from "../../utils/prisma.js";
import { createPostSchema, searchSchema, updatePostSchema } from "./schema";

export const postRouter = new Hono();

postRouter
	.get("/", async (c) => {
		const posts = await prisma.post.findMany();

		return c.json({
			success: true,
			data: posts,
		});
	})
	.get("/search", zValidator("query", searchSchema), async (c) => {
		const { q } = c.req.valid("query");

		const posts = await prisma.post.findMany({
			where: {
				OR: [{ title: { contains: q } }, { content: { contains: q } }],
			},
		});

		return c.json({
			success: true,
			data: posts,
		});
	})
	.get("/:id", async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json(
				{
					success: false,
					message: "Invalid post ID",
				},
				400,
			);
		}

		const post = await prisma.post.findUnique({
			where: { id },
		});

		if (!post) {
			return c.json(
				{
					success: false,
					message: "Post not found",
				},
				404,
			);
		}

		return c.json({
			success: true,
			data: post,
		});
	})
	.post("/", zValidator("json", createPostSchema), async (c) => {
		const body = c.req.valid("json");

		try {
			const newPost = await prisma.post.create({
				data: body,
			});

			return c.json(
				{
					success: true,
					message: "Post added successfully",
					data: newPost,
				},
				201,
			);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					return c.json(
						{
							success: false,
							message: `The slug '${body.slug}' is already taken.`,
						},
						409,
					);
				}
			}
			throw error;
		}
	})
	.post("/:id/publish", async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ success: false, message: "Invalid post ID" }, 400);
		}

		try {
			const updatedPost = await prisma.post.update({
				where: { id },
				data: {
					status: "published",
					publishedAt: new Date(),
				},
			});

			return c.json({
				success: true,
				message: "Post published successfully",
				data: updatedPost,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ success: false, message: "Post not found" }, 404);
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
			const updatedPost = await prisma.post.update({
				where: { id },
				data: {
					status: "draft",
				},
			});

			return c.json({
				success: true,
				message: "Post unpublished successfully",
				data: updatedPost,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ success: false, message: "Post not found" }, 404);
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
			const updatedPost = await prisma.post.update({
				where: { id },
				data: {
					status: "archived",
				},
			});

			return c.json({
				success: true,
				message: "Post archived successfully",
				data: updatedPost,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				return c.json({ success: false, message: "Post not found" }, 404);
			}
			throw error;
		}
	})
	.patch("/:id", zValidator("json", updatePostSchema), async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ success: false, message: "Invalid post ID" }, 400);
		}

		const body = c.req.valid("json");

		try {
			const updatedPost = await prisma.post.update({
				where: { id },
				data: body,
			});

			return c.json({
				success: true,
				message: "Post updated",
				data: updatedPost,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ success: false, message: "Post not found" }, 404);
				}

				if (error.code === "P2002") {
					return c.json(
						{
							success: false,
							message: `The slug '${body.slug}' is already taken.`,
						},
						409,
					);
				}
			}
			throw error;
		}
	})
	.delete("/:id", async (c) => {
		const id = parseId(c.req.param("id"));

		if (id === null) {
			return c.json({ success: false, message: "Invalid post ID" }, 400);
		}

		try {
			await prisma.post.delete({
				where: { id },
			});

			return c.json({
				success: true,
				message: "Post deleted successfully",
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return c.json({ success: false, message: "Post not found" }, 404);
				}
			}
			throw error;
		}
	});
