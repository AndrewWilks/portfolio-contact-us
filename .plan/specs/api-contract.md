# HTTP API Contract

Base URL, `/api`

## Health

GET `/health`  
200, `{ "ok": true }`

## Hello

GET `/hello`  
200, `{ "message": "Hello from Deno + Hono" }`

## Contacts

### Create

POST `/contacts`

- Request, `application/json`, `ContactCreate`
- Response, `201`, `Contact`

### List

GET `/contacts`

- Query, `q` optional search, `verified` optional boolean
- Response, `200`, `Contact[]`

### Verify

PATCH `/contacts/:id/verify`

- Response, `200`, `Contact`

### Delete

DELETE `/contacts/:id`

- Response, `204`, empty body

## Error shape

Non 2xx responses return

```json
{ "ok": false, "error": { "code": "string", "message": "string" } }
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
