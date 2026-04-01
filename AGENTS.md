# Agent Instructions for bp-file-system

## Project Overview

This is a NestJS monorepo using Turborepo with Prisma (MongoDB). The main application is in `apps/api`.

## Build, Lint, and Test Commands

### Root Level (Monorepo)
```bash
# Run all tasks across all packages
npm run dev          # Start development mode for all apps
npm run build        # Build all packages
npm run test         # Run tests for all packages
npm run test:e2e     # Run e2e tests for all packages
npm run lint         # Lint all packages
```

### App Level (apps/api)
```bash
# Navigation
cd apps/api

# Development
npm run dev          # Start with hot reload (watch mode)
npm run start        # Start production server
npm run start:dev    # Start with debug mode
npm run start:prod   # Start compiled production build

# Building
npm run build        # Compile TypeScript to JavaScript

# Testing
npm run test                    # Run all unit tests
npm run test:watch              # Run tests in watch mode
npm run test:cov                 # Run tests with coverage
npm run test:e2e                # Run e2e tests
npm run test:debug              # Debug tests with node inspect

# Testing specific files
npx jest src/customers/customers.service.spec.ts       # Single test file
npx jest --testPathPattern="customers"                  # Tests matching pattern
npx jest --testNamePattern="should be defined"          # Tests by name

# Linting and Formatting
npm run lint        # Lint and auto-fix
npm run format      # Format with Prettier
```

### Running a Single Test
```bash
cd apps/api
npx jest path/to/test.spec.ts --coverage
```

## Code Style Guidelines

### TypeScript Conventions

- **Strict Mode**: TypeScript strict mode is enabled. Avoid using `any` type.
- **Type Annotations**: Always prefer explicit types for function parameters and return types:
  ```typescript
  // Good
  async create(customer: CreateCustomerDto): Promise<Customer> { ... }
  
  // Avoid
  async create(customer) { ... }
  ```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `CustomersService`, `AppController` |
| Interfaces | PascalCase | `CreateCustomerDto` |
| Variables | camelCase | `customerId`, `shelfId` |
| Methods | camelCase | `retrieveShelf`, `createCustomer` |
| Files | kebab-case | `customers.service.ts`, `create-customer.dto.ts` |
| DTOs | PascalCase with suffixes | `CreateCustomerDto`, `UpdateCustomerDto` |
| Database models | PascalCase singular | `Customer` |

### Import Organization

Organize imports in this order (enforced by ESLint with `sort-imports`):
1. Node.js built-ins (`node:fs`, `node:path`)
2. External packages (`@nestjs/common`, `rxjs`)
3. Internal packages (`src/`, relative imports)
4. Type imports (`import type`)

```typescript
// Example
import { Controller, Get } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
```

### NestJS Patterns

**Controllers**:
- Use decorators for all HTTP methods (`@Get`, `@Post`, `@Patch`, `@Delete`)
- Use pipes for validation (`ValidationPipe`, `ParseIntPipe`)
- Use decorators for parameters (`@Param`, `@Body`, `@Query`, `@Query`)
- Always add JSDoc comments describing the endpoint

```typescript
@Controller('customers')
export class CustomersController {
    constructor(private readonly customerService: CustomersService) {}

    @Get(':id')     // GET /customers/:id
    retrieveOne(@Param('id') id: string) {
        return this.customerService.retrieveOne(id);
    }
}
```

**Services**:
- Mark with `@Injectable()` decorator
- Use constructor injection for dependencies
- Handle Prisma errors appropriately:
  ```typescript
  try {
      return await this.databaseService.customer.create({ data: customer });
  } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
              throw new ConflictException('customer already exists');
          }
      }
      throw error;
  }
  ```

**DTOs**:
- Use class-validator decorators for validation
- Use `@nestjs/mapped-types` `PartialType` for update DTOs
- Use `@nestjs/mapped-types` `PickType`, `OmitType` when needed

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    shelfId: string;
}
```

### Formatting (Prettier)

Configuration in `.prettierrc`:
- `singleQuote: true` - Use single quotes
- `trailingComma: "all"` - Add trailing commas everywhere

```typescript
// Good
const message = 'hello';

// Avoid
const message = "hello";
```

### Linting (ESLint)

ESLint config is shared via `@eeu/eslint-config` package in `packages/eslint-config/`.

**App-level config** (`apps/api/eslint.config.mjs`):
```javascript
import baseConfig from '@eeu/eslint-config/nestjs';
export default [...baseConfig];
```

**Shared config** (`packages/eslint-config/nestjs.js`):
- Uses `typescript-eslint` for TypeScript support
- `prettier/prettier` enabled for format checking
- `endOfLine: "auto"` to handle cross-platform line endings

Key rules:
- `@typescript-eslint/no-explicit-any`: Off (allowed)
- `@typescript-eslint/no-floating-promises`: Warn
- `@typescript-eslint/no-unsafe-argument`: Warn

### Error Handling

- Use NestJS built-in exceptions (`NotFoundException`, `ConflictException`, `BadRequestException`)
- Let unexpected errors propagate
- Log errors appropriately in services
- Use `console.error` for errors, `console.log` for debugging

### Prisma

- Prisma schema is in `apps/api/prisma/schema.prisma`
- After schema changes, run:
  ```bash
  cd apps/api
  npx prisma generate    # Generate Prisma client
  npx prisma db push     # Push schema to database
  ```
- Use the `DatabaseService` (extends `PrismaClient`) for all database operations

### Testing Conventions

**Unit Tests** (`*.spec.ts`):
- Place in same directory as source file
- Use `@nestjs/testing` `Test` and `TestingModule`
- Pattern:
  ```typescript
  describe('CustomersService', () => {
    let service: CustomersService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [CustomersService],
      }).compile();

      service = module.get<CustomersService>(CustomersService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
  ```

**E2E Tests** (`*.e2e-spec.ts`):
- Place in `test/` directory
- Use `supertest` for HTTP assertions
- Test file pattern: `*.e2e-spec.ts`

### File Structure

```
apps/api/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Root controller
│   ├── app.service.ts          # Root service
│   ├── database/              # Database module
│   │   ├── database.module.ts
│   │   ├── database.service.ts
│   │   └── database.service.spec.ts
│   └── customers/              # Feature module
│       ├── customers.module.ts
│       ├── customers.controller.ts
│       ├── customers.controller.spec.ts
│       ├── customers.service.ts
│       ├── customers.service.spec.ts
│       └── dto/
│           ├── create-customer.dto.ts
│           └── update-customer.dto.ts
├── prisma/
│   └── schema.prisma
└── test/
    ├── jest-e2e.json
    └── app.e2e-spec.ts
```

### Environment Variables

Environment files are gitignored (see `.gitignore`). Create `.env` for local development:
```
DATABASE_URL=mongodb://...
PORT=3000
```
