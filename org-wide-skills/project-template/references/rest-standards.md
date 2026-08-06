# REST API Design & Error Handling Standards

## Error Response Format

Follow a standardized JSON error response format across all APIs:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message describing the error."
  }
}
```

## Security & Data Exposure

- **Never** return sensitive stack traces to the client in production.
- **Never** return raw database error strings to the client.

## API Design

- Use standard HTTP status codes (200, 201, 400, 401, 403, 404, 500).
- Use noun-based resource paths (`/users`), not verb-based (`/getUsers`).
- Pagination, filtering, and sorting should use query parameters.
