# HTTP API Contract

Base URL, `/api`

## Health

GET `/health`\
200, `{ "ok": true }`

## Hello

GET `/hello`\
200, `{ "message": "Hello from Deno + Hono" }`

## Contacts

### Create

POST `/contacts`

- Request, `application/json`, `ContactCreate`
- Response, `201`, `Contact`

Notes:

- Request must be `Content-Type: application/json`.
- Success response should be wrapped in the standard envelope: `201 { "ok": true, "data": Contact }`.
- Validation failure should return `400 { "ok": false, "error": { "code": "validation", "message": "..." } }`.

### List

GET `/contacts`

- Query, `q` optional search, `verified` optional boolean
- Response, `200`, `Contact[]`

Notes:

- `q` is an optional string used for simple text search (name or email).
- `verified` is an optional boolean filter; when provided, results are filtered by verification status.
- Success response: `200 { "ok": true, "data": Contact[] }`.

### Verify

PATCH `/contacts/:id/verify`

- Response, `200`, `Contact`

### Delete

DELETE `/contacts/:id`

- Response, `204`, empty body

Notes:

- DELETE should return a `204` with an empty body on success. Errors should still follow the envelope.

## Error shape

Non 2xx responses return

```json
{ "ok": false, "error": { "code": "string", "message": "string" } }

Validation errors returned by `@hono/zod-validator` should map to `code: "validation"`.
```

## Schemas, Zod first

### ContactCreate

```typescript
{
firstName: string, min 1
lastName: string, min 1
email: string, email
phone?: string
message?: string, max 2000
}
```

### Contact

```typescript
{
id: string, uuid
...ContactCreate,
verified: boolean, default false
createdAt: number, epoch ms
}
```
