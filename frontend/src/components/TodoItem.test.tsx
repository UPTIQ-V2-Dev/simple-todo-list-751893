import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/types/todo';

const mockTodo: Todo = {
    id: '1',
    name: 'Test Todo Item',
    description: 'This is a test todo description',
    createdAt: new Date('2024-01-01T12:00:00Z')
};

const mockTodoWithoutDescription: Todo = {
    id: '2',
    name: 'Todo without description',
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

    it('displays description when provided', () => {
        render(<TodoItem todo={mockTodo} />);

        expect(screen.getByText('This is a test todo description')).toBeInTheDocument();
    });

    it('does not render description element when description is not provided', () => {
        const { container } = render(<TodoItem todo={mockTodoWithoutDescription} />);

        // Check that there's only one text element (the title) and no paragraph for description
        const paragraphs = container.querySelectorAll('p');
        expect(paragraphs).toHaveLength(0);
        expect(screen.getByText('Todo without description')).toBeInTheDocument();
    });

    it('does not render description element when description is empty', () => {
        const todoWithEmptyDescription: Todo = {
            id: '3',
            name: 'Todo with empty description',
            description: '',
            createdAt: new Date('2024-01-01')
        };

        const { container } = render(<TodoItem todo={todoWithEmptyDescription} />);

        // Check that there's no paragraph for description
        const paragraphs = container.querySelectorAll('p');
        expect(paragraphs).toHaveLength(0);
        expect(screen.getByText('Todo with empty description')).toBeInTheDocument();
    });

    it('handles long descriptions', () => {
        const todoWithLongDescription: Todo = {
            id: '4',
            name: 'Todo with long description',
            description:
                'This is a very long description that might wrap to multiple lines and should be displayed properly without breaking the layout or causing any rendering issues.',
            createdAt: new Date('2024-01-01')
        };

        render(<TodoItem todo={todoWithLongDescription} />);

        expect(screen.getByText(todoWithLongDescription.description!)).toBeInTheDocument();
    });

    it('handles special characters in description', () => {
        const todoWithSpecialDescription: Todo = {
            id: '5',
            name: 'Todo with special chars in description',
            description: 'Description with @#$%^&*() special chars & symbols!',
            createdAt: new Date('2024-01-01')
        };

        render(<TodoItem todo={todoWithSpecialDescription} />);

        expect(screen.getByText(todoWithSpecialDescription.description!)).toBeInTheDocument();
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
