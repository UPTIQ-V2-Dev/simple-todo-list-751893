# Todo App Implementation Plan

## Project Overview

A minimal single-page todo application with React 19, Vite, Shadcn/UI, and Tailwind v4. The app allows users to add todos with just a name field - no edit, delete, or completion functionality required.

## Technical Stack

- **React 19** with TypeScript
- **Vite** as build tool
- **Shadcn/UI** components (already configured)
- **Tailwind v4** for styling
- **Vitest + React Testing Library** for testing
- **React Hook Form + Zod** for form validation

## Implementation Plan

### Phase 1: Core Types & State Management

**Files to create/modify:**

- `src/types/todo.ts` - Todo interface definition
- `src/hooks/useTodos.ts` - Custom hook for todo state management

**Components:**

- Simple in-memory state management using React useState
- Todo interface: `{ id: string, name: string, createdAt: Date }`

### Phase 2: UI Components

**Files to create/modify:**

- `src/components/TodoForm.tsx` - Form component for adding todos
- `src/components/TodoList.tsx` - List component to display todos
- `src/components/TodoItem.tsx` - Individual todo item component

**Shadcn/UI components to use:**

- `Card` - Container for the todo app
- `Input` - Text input for todo name
- `Button` - Submit button for form
- `Form` - Form wrapper with validation

### Phase 3: Main App Integration

**Files to modify:**

- `src/App.tsx` - Main app component integrating all parts

**Layout:**

- Single page with centered card layout
- Form at the top, todo list below
- Responsive design using Tailwind v4

### Phase 4: Form Validation & Error Handling

**Files to create/modify:**

- `src/lib/validations.ts` - Zod schemas for form validation

**Validation rules:**

- Todo name: required, min 1 char, max 100 chars, trim whitespace
- Prevent duplicate todo names

## File Structure

```
src/
├── components/
│   ├── TodoForm.tsx
│   ├── TodoList.tsx
│   └── TodoItem.tsx
├── hooks/
│   └── useTodos.ts
├── types/
│   └── todo.ts
├── lib/
│   └── validations.ts
└── App.tsx
```

## Testing Strategy

### Testing Framework Setup

- **Vitest** with jsdom environment (already configured)
- **React Testing Library** for component testing
- **@testing-library/user-event** for user interactions
- **MSW** (Mock Service Worker) for API mocking if needed later

### Test File Organization

```
src/
├── test/
│   ├── setup.ts (existing)
│   ├── test-utils.tsx
│   └── __mocks__/
└── components/
    ├── TodoForm.test.tsx
    ├── TodoList.test.tsx
    ├── TodoItem.test.tsx
    └── __tests__/
```

### Unit/Component Tests

#### TodoForm Component Tests (`TodoForm.test.tsx`)

- ✅ Renders form with input and submit button
- ✅ Shows validation error for empty input
- ✅ Shows validation error for whitespace-only input
- ✅ Shows validation error for input exceeding 100 characters
- ✅ Calls onSubmit with trimmed value for valid input
- ✅ Clears form after successful submission
- ✅ Prevents submission of duplicate todo names
- ✅ Form accessibility (labels, ARIA attributes)

#### TodoList Component Tests (`TodoList.test.tsx`)

- ✅ Renders empty state message when no todos
- ✅ Renders list of todos correctly
- ✅ Displays todos in reverse chronological order (newest first)
- ✅ Shows correct todo count

#### TodoItem Component Tests (`TodoItem.test.tsx`)

- ✅ Renders todo name correctly
- ✅ Displays creation timestamp
- ✅ Has proper semantic markup

#### useTodos Hook Tests (`useTodos.test.tsx`)

- ✅ Initializes with empty todos array
- ✅ Adds new todo with correct structure
- ✅ Generates unique IDs for todos
- ✅ Prevents adding duplicate todo names
- ✅ Maintains todos in state correctly

#### App Integration Tests (`App.test.tsx`)

- ✅ Renders main app layout
- ✅ Form and list components integration
- ✅ End-to-end todo addition flow
- ✅ Error handling integration

### Test Utilities (`test-utils.tsx`)

```typescript
// Custom render function with providers
// Mock data generators for todos
// Common test assertions helpers
// User event helpers for form interactions
```

### Key Test Patterns

#### Component Testing Pattern

```typescript
describe('TodoForm', () => {
  it('should submit valid todo', async () => {
    const mockOnSubmit = vi.fn()
    const user = userEvent.setup()

    render(<TodoForm onSubmit={mockOnSubmit} existingTodos={[]} />)

    await user.type(screen.getByRole('textbox'), 'New todo')
    await user.click(screen.getByRole('button', { name: /add/i }))

    expect(mockOnSubmit).toHaveBeenCalledWith('New todo')
  })
})
```

#### Hook Testing Pattern

```typescript
describe('useTodos', () => {
    it('should add todo', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Test todo');
        });

        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0].name).toBe('Test todo');
    });
});
```

### Form Validation Test Cases

- Empty input submission
- Whitespace-only input
- Maximum character limit (100 chars)
- Duplicate todo names
- Special characters handling
- Input trimming behavior

### Error Handling Test Cases

- Form validation errors display
- Duplicate todo error messaging
- Network error simulation (future API integration)

### Test Commands

```bash
npm run test          # Run tests in watch mode
npm run test:ci       # Run tests once for CI
npm run test:coverage # Run with coverage report
npm run test:ui       # Run with Vitest UI
```

### Coverage Targets

- **Components**: 90%+ line coverage
- **Hooks**: 95%+ line coverage
- **Utils/Validation**: 100% line coverage
- **Critical paths**: 100% (form submission, todo addition)

## Development Phases

### Phase 1: Foundation (30 min)

- Set up types and validation schemas
- Create useTodos hook with basic functionality
- Write hook tests

### Phase 2: Components (45 min)

- Build TodoForm with validation
- Create TodoList and TodoItem components
- Write component tests

### Phase 3: Integration (15 min)

- Update App.tsx with new components
- Style with Tailwind v4
- Write integration tests

### Phase 4: Polish & Testing (30 min)

- Complete test coverage
- Error handling refinement
- Accessibility improvements
- Final styling touches

## Success Criteria

- ✅ User can add todos with name only
- ✅ Form validates input (required, length, duplicates)
- ✅ Todos display in reverse chronological order
- ✅ Responsive design works on mobile/desktop
- ✅ 90%+ test coverage achieved
- ✅ All tests pass in CI environment
- ✅ Accessible form controls and interactions
