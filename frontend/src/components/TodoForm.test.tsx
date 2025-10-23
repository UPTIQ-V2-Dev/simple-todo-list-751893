import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';
import { Todo } from '@/types/todo';

const mockTodos: Todo[] = [
    {
        id: '1',
        name: 'Existing Todo',
        description: 'This is an existing todo',
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
        expect(screen.getByRole('textbox', { name: /todo description/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter todo name...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter todo description...')).toBeInTheDocument();
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

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), '   ');
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

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), longText);
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

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), '  Valid Todo  ');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Valid Todo', '');
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

        const input = screen.getByRole('textbox', { name: /todo name/i });
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

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Existing Todo');
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

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'EXISTING TODO');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Todo with this name already exists')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with both name and description', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Test Todo');
        await user.type(screen.getByRole('textbox', { name: /todo description/i }), 'Test description');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Test Todo', 'Test description');
        });
    });

    it('shows validation error for description exceeding 500 characters', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();
        const longDescription = 'a'.repeat(501);

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Test Todo');
        await user.type(screen.getByRole('textbox', { name: /todo description/i }), longDescription);
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Description must be less than 500 characters')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('allows empty description', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Test Todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Test Todo', '');
        });
    });

    it('trims description whitespace', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Test Todo');
        await user.type(screen.getByRole('textbox', { name: /todo description/i }), '  Test description  ');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Test Todo', 'Test description');
        });
    });

    it('clears both name and description after successful submission', async () => {
        const mockOnSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        const nameInput = screen.getByRole('textbox', { name: /todo name/i });
        const descriptionInput = screen.getByRole('textbox', { name: /todo description/i });

        await user.type(nameInput, 'Test Todo');
        await user.type(descriptionInput, 'Test description');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });

        expect(nameInput).toHaveValue('');
        expect(descriptionInput).toHaveValue('');
    });

    it('has proper accessibility attributes', () => {
        const mockOnSubmit = vi.fn();
        render(
            <TodoForm
                onSubmit={mockOnSubmit}
                existingTodos={[]}
            />
        );

        const nameInput = screen.getByRole('textbox', { name: /todo name/i });
        const descriptionInput = screen.getByRole('textbox', { name: /todo description/i });

        expect(nameInput).toHaveAttribute('aria-label', 'Todo name');
        expect(nameInput).toHaveAttribute('placeholder', 'Enter todo name...');
        expect(descriptionInput).toHaveAttribute('aria-label', 'Todo description');
        expect(descriptionInput).toHaveAttribute('placeholder', 'Enter todo description...');
    });
});
