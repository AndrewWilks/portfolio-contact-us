# API Examples

Base URLs:

- Direct API: <http://localhost:8000>
- Via Vite proxy: <http://localhost:3000/api> (proxy rewrites "/api" away)

Health and hello:

```powershell
# Health (direct)
curl http://localhost:8000/health

# Hello (direct)
curl http://localhost:8000/hello

# Via Vite proxy (health)
curl http://localhost:3000/api/health
```

Create a contact:

```powershell
curl -X POST "http://localhost:8000/contacts" `
  -H "Content-Type: application/json" `
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john.doe@example.com",
    "phone":"0412 345 678",
    "message":"Hello!"
  }'

# Or via proxy
curl -X POST "http://localhost:3000/api/contacts" `
  -H "Content-Type: application/json" `
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john.doe@example.com"
  }'
```

List contacts:

```powershell
# All contacts
curl "http://localhost:8000/contacts"

# Filter by search and verified
curl "http://localhost:8000/contacts?q=john&verified=true"
```

Verify, unverify, update, delete:

```powershell
$ID = "<contact-uuid>"

# Verify
curl -X PATCH "http://localhost:8000/contacts/$ID/verify"

# Unverify
curl -X PATCH "http://localhost:8000/contacts/$ID/unverify"

# Partial update
curl -X PATCH "http://localhost:8000/contacts/$ID" `
  -H "Content-Type: application/json" `
  -d '{ "message": "New message" }'

# Delete
curl -X DELETE "http://localhost:8000/contacts/$ID"
```

Fetch example (works in Deno/Node/Browser):

```ts
const res = await fetch("http://localhost:8000/contacts", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  }),
});
const body = await res.json();
console.log(body);
```
