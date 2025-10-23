import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';

describe('useTodos', () => {
    it('initializes with empty todos array', () => {
        const { result } = renderHook(() => useTodos());

        expect(result.current.todos).toEqual([]);
    });

    it('adds new todo with correct structure', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Test todo');
        });

        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0]).toEqual({
            id: expect.any(String),
            name: 'Test todo',
            description: undefined,
            createdAt: expect.any(Date)
        });
    });

    it('generates unique IDs for todos', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('First todo');
        });

        act(() => {
            result.current.addTodo('Second todo');
        });

        expect(result.current.todos).toHaveLength(2);
        expect(result.current.todos[0].id).not.toBe(result.current.todos[1].id);
    });

    it('prevents adding duplicate todo names', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Duplicate todo');
        });

        expect(() => {
            act(() => {
                result.current.addTodo('Duplicate todo');
            });
        }).toThrow('Todo with this name already exists');

        expect(result.current.todos).toHaveLength(1);
    });

    it('prevents adding duplicate todo names (case insensitive)', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Case Test');
        });

        expect(() => {
            act(() => {
                result.current.addTodo('CASE TEST');
            });
        }).toThrow('Todo with this name already exists');

        expect(result.current.todos).toHaveLength(1);
    });

    it('trims whitespace from todo names', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('  Trimmed Todo  ');
        });

        expect(result.current.todos[0].name).toBe('Trimmed Todo');
    });

    it('maintains todos in state correctly', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('First todo');
        });

        act(() => {
            result.current.addTodo('Second todo');
        });

        act(() => {
            result.current.addTodo('Third todo');
        });

        expect(result.current.todos).toHaveLength(3);
        expect(result.current.todos[0].name).toBe('Third todo'); // Most recent first
        expect(result.current.todos[1].name).toBe('Second todo');
        expect(result.current.todos[2].name).toBe('First todo');
    });

    it('adds todos in reverse chronological order', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('First');
        });

        act(() => {
            result.current.addTodo('Second');
        });

        // Second todo should be first in the array (most recent first)
        expect(result.current.todos[0].name).toBe('Second');
        expect(result.current.todos[1].name).toBe('First');
        expect(result.current.todos[0].createdAt.getTime()).toBeGreaterThanOrEqual(
            result.current.todos[1].createdAt.getTime()
        );
    });

    it('adds todo with description', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Test todo', 'Test description');
        });

        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0]).toEqual({
            id: expect.any(String),
            name: 'Test todo',
            description: 'Test description',
            createdAt: expect.any(Date)
        });
    });

    it('adds todo without description', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Test todo');
        });

        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0]).toEqual({
            id: expect.any(String),
            name: 'Test todo',
            description: undefined,
            createdAt: expect.any(Date)
        });
    });

    it('trims whitespace from description', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Test todo', '  Test description  ');
        });

        expect(result.current.todos[0].description).toBe('Test description');
    });

    it('handles empty description string', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Test todo', '');
        });

        expect(result.current.todos[0].description).toBeUndefined();
    });

    it('handles whitespace-only description', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Test todo', '   ');
        });

        expect(result.current.todos[0].description).toBeUndefined();
    });

    it('handles empty string after trimming', () => {
        const { result } = renderHook(() => useTodos());

        expect(() => {
            act(() => {
                result.current.addTodo('   ');
            });
        }).toThrow('Todo name cannot be empty');
    });
});
