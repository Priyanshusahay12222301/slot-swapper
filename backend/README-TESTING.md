# 🧪 Testing Guide for Slot Swapper Backend

This project includes a comprehensive test suite covering authentication, events management, and the complex swap transaction logic.

## 📋 Test Overview

### Test Types
- **Unit Tests**: Business logic, utilities, and validation functions
- **Integration Tests**: API endpoints with database operations
- **Transaction Tests**: Complex swap operations with atomic transactions

### Test Coverage
- ✅ Authentication (signup, login, JWT handling)
- ✅ Event CRUD operations
- ✅ Swap request creation and processing
- ✅ Transaction rollback scenarios
- ✅ Input validation and error handling

## 🚀 Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npx jest __tests__/unit.test.js
npx jest __tests__/auth.test.js
```

### Test Scripts
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## 📁 Test Structure

```
backend/__tests__/
├── setup.js              # Test configuration and database setup
├── unit.test.js           # Unit tests (no database required)
├── auth.test.js           # Authentication endpoint tests
├── events.test.js         # Events management tests
└── swaps.test.js          # Complex swap transaction tests
```

## 🔧 Configuration

### Jest Configuration
```json
{
  "testEnvironment": "node",
  "setupFilesAfterEnv": ["<rootDir>/__tests__/setup.js"],
  "coverageDirectory": "coverage",
  "collectCoverageFrom": [
    "routes/**/*.js",
    "models/**/*.js", 
    "middleware/**/*.js"
  ],
  "testMatch": ["**/__tests__/**/*.js", "**/*.test.js"]
}
```

### Environment Setup
The tests use either:
1. **Local MongoDB** (if available): `mongodb://127.0.0.1:27017/slotswapper-test`
2. **Mocked operations** (if MongoDB unavailable)

Set environment variable for custom test database:
```bash
export MONGO_TEST_URI="mongodb://localhost:27017/your-test-db"
```

## 📊 Test Categories

### 1. Unit Tests (`unit.test.js`)
**No database required** - Tests isolated business logic:

- **API Structure**: Basic Express route handling
- **JWT Utilities**: Token generation, verification, expiration
- **Password Hashing**: bcrypt operations and security
- **Validation Logic**: Email formats, time ranges
- **Business Rules**: Status transitions, swap validations

```bash
# Run unit tests only (fastest)
npx jest __tests__/unit.test.js
```

### 2. Authentication Tests (`auth.test.js`)
**Database integration** - Tests auth endpoints:

- **User Registration**: Valid/invalid signup attempts
- **User Login**: Credential validation and JWT issuance
- **Protected Routes**: Token-based access control
- **Error Handling**: Duplicate emails, weak passwords

### 3. Events Tests (`events.test.js`)
**Database integration** - Tests event management:

- **CRUD Operations**: Create, read, update, delete events
- **Authorization**: User can only modify their own events
- **Validation**: Time ranges, future dates, status transitions
- **Marketplace**: Filtering swappable events from other users

### 4. Swap Tests (`swaps.test.js`)
**Database integration** - Tests complex swap logic:

- **Swap Requests**: Creation, validation, duplicate prevention
- **Atomic Transactions**: Ownership exchange with rollback
- **Status Management**: SWAP_PENDING handling
- **Response Processing**: Accept/reject swap requests
- **Error Recovery**: Transaction failure scenarios

## 🎯 Key Test Features

### Transaction Testing
The swap tests include **atomic transaction verification**:

```javascript
// Verifies ownership exchange happens atomically
expect(updatedEvent1.owner.toString()).toBe(user2Id);
expect(updatedEvent2.owner.toString()).toBe(user1Id);

// Tests rollback on transaction failure
expect(swapRequest.status).toBe('PENDING'); // Should remain unchanged if failed
```

### Comprehensive Error Scenarios
- Invalid authentication tokens
- Non-existent resource access
- Concurrent modification attempts
- Database connection failures
- Input validation errors

### Mock vs Real Database
Tests gracefully handle both scenarios:
- When MongoDB is available: Full integration testing
- When MongoDB unavailable: Mocked operations for CI/CD

## 📈 Coverage Goals

Target coverage areas:
- **Routes**: All API endpoints and error paths
- **Models**: Validation rules and business logic
- **Middleware**: Authentication and error handling
- **Utilities**: Helper functions and validators

```bash
# Generate detailed coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🐛 Debugging Tests

### Common Issues

**Database Connection Timeouts**:
```bash
# Check if MongoDB is running locally
mongosh --eval "db.adminCommand('ismaster')"

# Or skip database tests
npx jest __tests__/unit.test.js
```

**Memory Issues with Large Test Suites**:
```bash
# Run tests with increased memory
node --max-old-space-size=4096 ./node_modules/.bin/jest
```

**Timeout Errors**:
```javascript
// Increase timeout for slow operations
jest.setTimeout(30000); // 30 seconds
```

### Debugging Tools
```bash
# Run single test with debugging
npx jest --testNamePattern="should accept swap" --verbose

# Run tests with debug output
DEBUG=* npm test

# Run with Node.js inspector
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: |
    cd backend
    npm test
  env:
    NODE_ENV: test
    MONGO_TEST_URI: ${{ secrets.MONGO_TEST_URI }}
```

### Docker Testing
```bash
# Run tests in Docker environment
docker-compose exec backend npm test

# Or with dedicated test service
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## ✅ Test Checklist

When adding new features, ensure:

- [ ] **Unit tests** for business logic
- [ ] **Integration tests** for API endpoints
- [ ] **Error handling** for invalid inputs
- [ ] **Authorization checks** for protected resources
- [ ] **Transaction tests** for database operations
- [ ] **Mock scenarios** for external dependencies

## 🔄 Best Practices

### Test Organization
- Group related tests with `describe()` blocks
- Use descriptive test names that explain the scenario
- Keep tests independent and atomic
- Clean up after each test (automatic with our setup)

### Assertion Patterns
```javascript
// Good: Specific expectations
expect(response.body).toMatchObject({
  status: 'SWAPPABLE',
  owner: expectedUserId
});

// Good: Property existence checks  
expect(response.body).toHaveProperty('token');
expect(response.body.user).not.toHaveProperty('passwordHash');
```

### Async/Await Best Practices
```javascript
// Always await async operations
const response = await request(app)
  .post('/api/signup')
  .send(userData)
  .expect(201);

// Handle both success and error cases
expect(() => jwt.verify(invalidToken, JWT_SECRET)).toThrow();
```

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest API Testing](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Mongoose Testing Guide](https://mongoosejs.com/docs/jest.html)

**🎉 Happy Testing!** Your Slot Swapper backend now has professional-grade test coverage.