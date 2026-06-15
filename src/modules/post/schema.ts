import { z } from "zod";

export const createPostSchema = z.object({
	title: z.string().min(1, "title must be at least one character"),
	slug: z.string().min(1, "slug must be at least one character"),
	content: z.string().min(1, "content must be at least one character"),
	excerpt: z.string(),
	status: z.enum(["draft", "published", "archived"]),
});

export const updatePostSchema = z.object({
	title: z.string().optional(),
	slug: z.string().optional(),
	content: z.string().optional(),
	excerpt: z.string().optional(),
	status: z.enum(["draft", "published", "archived"]).optional(),
});
