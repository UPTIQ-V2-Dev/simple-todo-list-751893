import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';
import { Todo } from '@/types/todo';

const mockTodos: Todo[] = [
    {
        id: '1',
        name: 'Existing Todo',
        createdAt: new Date('2024-01-01')
    }
];

describe('TodoForm', () => {
    it('renders form with input and submit button', () => {
        const mockOnSubmit = vi.fn();
        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        expect(screen.getByRole('textbox', { name: /todo name/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter todo name...')).toBeInTheDocument();
    });

    it('shows validation error for empty input', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Todo name is required')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error for whitespace-only input', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.type(screen.getByRole('textbox'), '   ');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Todo name is required')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error for input exceeding 100 characters', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();
        const longText = 'a'.repeat(101);

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.type(screen.getByRole('textbox'), longText);
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Todo name must be less than 100 characters')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with trimmed value for valid input', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.type(screen.getByRole('textbox'), '  Valid Todo  ');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Valid Todo');
        });
    });

    it('clears form after successful submission', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        const input = screen.getByRole('textbox');
        await user.type(input, 'New Todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });

        expect(input).toHaveValue('');
    });

    it('prevents submission of duplicate todo names', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={mockTodos}
            />
        );

        await user.type(screen.getByRole('textbox'), 'Existing Todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Todo with this name already exists')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('prevents submission of duplicate todo names (case insensitive)', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={mockTodos}
            />
        );

        await user.type(screen.getByRole('textbox'), 'EXISTING TODO');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Todo with this name already exists')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('has proper accessibility attributes', () => {
        const mockOnSubmit = vi.fn();
        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        const input = screen.getByRole('textbox', { name: /todo name/i });
        expect(input).toHaveAttribute('aria-label', 'Todo name');
        expect(input).toHaveAttribute('placeholder', 'Enter todo name...');
    });
});
