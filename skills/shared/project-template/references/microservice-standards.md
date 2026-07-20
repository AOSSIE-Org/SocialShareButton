# Microservice & Monorepo Standards

## Monorepo Structure

- Extract shared logic, types, and utilities to a generic `packages/` or `libs/` folder.
- Ensure strict boundary enforcement — services should not directly import from other service implementations.

## Service Design

- **Statelessness:** Keep services stateless. Use Redis or the external database for state sharing.
- **Communication:** Services should communicate via HTTP REST or gRPC.
- **No Shared Databases:** Do NOT use direct database-to-database connections across services. Each service owns its data.

## Environments

- Use distinct environments for testing, staging, and production.
- Environment variables must be strictly validated on service startup.
