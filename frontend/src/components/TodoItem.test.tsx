import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/types/todo';

const mockTodo: Todo = {
    id: '1',
    name: 'Test Todo Item',
    createdAt: new Date('2024-01-01T12:00:00Z')
};

describe('TodoItem', () => {
    it('renders todo name correctly', () => {
        render(<TodoItem todo={mockTodo} />);

        expect(screen.getByText('Test Todo Item')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Todo Item');
    });

    it('displays creation timestamp', () => {
        render(<TodoItem todo={mockTodo} />);

        const timeElement = screen.getByRole('time');
        expect(timeElement).toBeInTheDocument();
        expect(timeElement).toHaveAttribute('dateTime', '2024-01-01T12:00:00.000Z');
    });

    it('formats date correctly', () => {
        render(<TodoItem todo={mockTodo} />);

        // The exact format may vary based on locale, but should contain date/time info
        const timeElement = screen.getByRole('time');
        expect(timeElement.textContent).toMatch(/Jan/);
        expect(timeElement.textContent).toMatch(/2024/);
    });

    it('has proper semantic markup', () => {
        render(<TodoItem todo={mockTodo} />);

        // Check for heading structure
        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

        // Check for time element with datetime attribute
        const timeElement = screen.getByRole('time');
        expect(timeElement).toHaveAttribute('dateTime');
    });

    it('renders with card structure', () => {
        const { container } = render(<TodoItem todo={mockTodo} />);

        // Check if the component is wrapped in a div element (card structure)
        expect(container.firstChild).toBeDefined();
        expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('handles long todo names', () => {
        const longNameTodo: Todo = {
            id: '2',
            name: 'This is a very long todo name that might wrap to multiple lines and should be displayed properly',
            createdAt: new Date('2024-01-01')
        };

        render(<TodoItem todo={longNameTodo} />);

        expect(screen.getByText(longNameTodo.name)).toBeInTheDocument();
    });

    it('handles special characters in todo name', () => {
        const specialCharTodo: Todo = {
            id: '3',
            name: 'Todo with @#$%^&*() special chars!',
            createdAt: new Date('2024-01-01')
        };

        render(<TodoItem todo={specialCharTodo} />);

        expect(screen.getByText(specialCharTodo.name)).toBeInTheDocument();
    });
});
