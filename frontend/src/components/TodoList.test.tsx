import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { Todo } from '@/types/todo';

const mockTodos: Todo[] = [
    {
        id: '1',
        name: 'First Todo',
        createdAt: new Date('2024-01-02')
    },
    {
        id: '2',
        name: 'Second Todo',
        createdAt: new Date('2024-01-01')
    },
    {
        id: '3',
        name: 'Third Todo',
        createdAt: new Date('2024-01-03')
    }
];

describe('TodoList', () => {
    it('renders empty state message when no todos', () => {
        render(<TodoList todos={[]} />);

        expect(screen.getByText('No todos yet. Add your first todo above!')).toBeInTheDocument();
        expect(screen.queryByText('Your Todos')).not.toBeInTheDocument();
    });

    it('renders list of todos correctly', () => {
        render(<TodoList todos={mockTodos} />);

        expect(screen.getByText('Your Todos')).toBeInTheDocument();
        expect(screen.getByText('First Todo')).toBeInTheDocument();
        expect(screen.getByText('Second Todo')).toBeInTheDocument();
        expect(screen.getByText('Third Todo')).toBeInTheDocument();
    });

    it('displays todos in the order provided', () => {
        render(<TodoList todos={mockTodos} />);

        const todoElements = screen.getAllByText(/Todo$/);
        expect(todoElements[0]).toHaveTextContent('First Todo');
        expect(todoElements[1]).toHaveTextContent('Second Todo');
        expect(todoElements[2]).toHaveTextContent('Third Todo');
    });

    it('shows correct todo count for single todo', () => {
        const singleTodo = [mockTodos[0]];
        render(<TodoList todos={singleTodo} />);

        expect(screen.getByText('1 todo')).toBeInTheDocument();
    });

    it('shows correct todo count for multiple todos', () => {
        render(<TodoList todos={mockTodos} />);

        expect(screen.getByText('3 todos')).toBeInTheDocument();
    });

    it('renders todo count section when todos exist', () => {
        render(<TodoList todos={mockTodos} />);

        expect(screen.getByText('Your Todos')).toBeInTheDocument();
        expect(screen.getByText('3 todos')).toBeInTheDocument();
    });
});
