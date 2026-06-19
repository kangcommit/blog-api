# Blog API

A RESTful API for a blog built with Hono, Prisma, and SQLite.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Database:** SQLite with [Prisma](https://www.prisma.io/) ORM
- **Validation:** [Zod](https://github.com/colinhacks/zod)
- **Language:** TypeScript

## Features

- Full CRUD operations for blog posts
- Post status management (draft, published, archived)
- Search posts by title or content
- Type-safe request validation
- RESTful API design

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Apply database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

The server will start at `http://localhost:8000`

## API Endpoints

All endpoints are prefixed with `/posts`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| GET | `/posts/search?q=` | Search posts by title or content |
| GET | `/posts/:id` | Get a single post by ID |
| POST | `/posts` | Create a new post |
| POST | `/posts/:id/publish` | Publish a post |
| POST | `/posts/:id/unpublish` | Unpublish a post (set to draft) |
| POST | `/posts/:id/archive` | Archive a post |
| PATCH | `/posts/:id` | Update a post |
| DELETE | `/posts/:id` | Delete a post |

### Request/Response Examples

#### Create Post

**Request:**
```bash
curl -X POST http://localhost:8000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post.",
    "excerpt": "A short summary"
  }'
```

**Response:**
```json
{
  "message": "Post Added successfully",
  "data": {
    "id": 1,
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post.",
    "excerpt": "A short summary",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get All Posts

**Request:**
```bash
curl http://localhost:8000/posts
```

**Response:**
```json
{
  "message": "Posts retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "My First Post",
      "slug": "my-first-post",
      "content": "This is the content of my first post.",
      "excerpt": "A short summary",
      "status": "published",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Second Post",
      "slug": "second-post",
      "content": "Content of the second post.",
      "excerpt": "Another summary",
      "status": "draft",
      "createdAt": "2024-01-05T00:00:00.000Z",
      "updatedAt": "2024-01-05T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Post

**Request:**
```bash
curl http://localhost:8000/posts/1
```

**Response:**
```json
{
  "message": "Post retrieved successfully",
  "data": {
    "id": 1,
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post.",
    "excerpt": "A short summary",
    "status": "published",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T10:30:00.000Z"
  }
}
```

#### Search Posts

**Request:**
```bash
curl "http://localhost:8000/posts/search?q=first"
```

**Response:**
```json
{
  "message": "Posts retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "My First Post",
      "slug": "my-first-post",
      "content": "This is the content of my first post.",
      "excerpt": "A short summary",
      "status": "published",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T10:30:00.000Z"
    }
  ]
}
```

#### Update Post

**Request:**
```bash
curl -X PATCH http://localhost:8000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

**Response:**
```json
{
  "message": "Post Updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "slug": "my-first-post",
    "content": "This is the content of my first post.",
    "excerpt": "A short summary",
    "status": "published",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T14:45:00.000Z"
  }
}
```

#### Publish Post

**Request:**
```bash
curl -X POST http://localhost:8000/posts/1/publish \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "message": "Post published successfully",
  "data": {
    "id": 1,
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post.",
    "excerpt": "A short summary",
    "status": "published",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
```

#### Unpublish Post

**Request:**
```bash
curl -X POST http://localhost:8000/posts/1/unpublish \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "message": "Post unpublished successfully",
  "data": {
    "id": 1,
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post.",
    "excerpt": "A short summary",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T15:05:00.000Z"
  }
}
```

#### Archive Post

**Request:**
```bash
curl -X POST http://localhost:8000/posts/1/archive \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "message": "Post archived successfully",
  "data": {
    "id": 1,
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post.",
    "excerpt": "A short summary",
    "status": "archived",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T15:10:00.000Z"
  }
}
```

#### Delete Post

**Request:**
```bash
curl -X DELETE http://localhost:8000/posts/1
```

**Response:**
```json
{
  "message": "Post deleted successfully",
  "data": null
}
```

## Project Structure

```
blog-api/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/      # Database migrations
├── src/
│   ├── index.ts         # Application entry point
│   ├── modules/
│   │   └── post/
│   │       ├── router.ts    # Post API routes
│   │       └── schema.ts    # Validation schemas
│   ├── utils/
│   │   ├── params.ts    # Utility functions
│   │   └── prisma.ts    # Prisma client instance
│   └── generated/       # Generated Prisma client
├── package.json
└── tsconfig.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build the TypeScript project |
| `pnpm start` | Start the production server |
| `pnpm prisma generate` | Generate Prisma client |
| `pnpm prisma migrate` | Apply database migrations |

## Database

The project uses SQLite. The database file is located at `dev.db`. 

### Post Model

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Auto-incremented primary key |
| title | String | Post title |
| slug | String | URL-friendly slug |
| content | String | Full post content |
| excerpt | String | Short summary |
| status | String | draft, published, or archived |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## License

MIT
