import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('App', () => {
    it('renders main app layout', () => {
        render(<App />);

        expect(screen.getByText('Simple Todo App')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter todo name...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter todo description...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
        expect(screen.getByText('No todos yet. Add your first todo above!')).toBeInTheDocument();
    });

    it('integrates form and list components', () => {
        render(<App />);

        // Form should be present
        expect(screen.getByRole('textbox', { name: /todo name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /todo description/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();

        // Empty state should be shown initially
        expect(screen.getByText('No todos yet. Add your first todo above!')).toBeInTheDocument();
        expect(screen.queryByText('Your Todos')).not.toBeInTheDocument();
    });

    it('completes end-to-end todo addition flow', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Initially shows empty state
        expect(screen.getByText('No todos yet. Add your first todo above!')).toBeInTheDocument();

        // Add a todo
        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'My first todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        // Todo should appear in the list
        await waitFor(() => {
            expect(screen.getByText('My first todo')).toBeInTheDocument();
        });

        expect(screen.getByText('Your Todos')).toBeInTheDocument();
        expect(screen.getByText('1 todo')).toBeInTheDocument();
        expect(screen.queryByText('No todos yet. Add your first todo above!')).not.toBeInTheDocument();

        // Form should be cleared
        expect(screen.getByRole('textbox', { name: /todo name/i })).toHaveValue('');
    });

    it('handles multiple todo additions', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Add first todo
        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'First todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('First todo')).toBeInTheDocument();
        });

        // Add second todo
        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Second todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Second todo')).toBeInTheDocument();
        });

        // Both todos should be visible
        expect(screen.getByText('First todo')).toBeInTheDocument();
        expect(screen.getByText('Second todo')).toBeInTheDocument();
        expect(screen.getByText('2 todos')).toBeInTheDocument();
    });

    it('handles error integration - duplicate todos', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Add first todo
        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Duplicate todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Duplicate todo')).toBeInTheDocument();
        });

        // Try to add the same todo again
        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Duplicate todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        // Should show error message
        await waitFor(() => {
            expect(screen.getByText('Todo with this name already exists')).toBeInTheDocument();
        });

        // Should still only have one todo
        expect(screen.getByText('1 todo')).toBeInTheDocument();
    });

    it('handles form validation integration', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Try to submit empty form
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Todo name is required')).toBeInTheDocument();
        });

        // Should still show empty state
        expect(screen.getByText('No todos yet. Add your first todo above!')).toBeInTheDocument();
    });

    it('displays todos with timestamps', async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Timestamped todo');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        await waitFor(() => {
            expect(screen.getByText('Timestamped todo')).toBeInTheDocument();
        });

        // Should have a time element
        expect(screen.getByRole('time')).toBeInTheDocument();
    });

    it('completes end-to-end todo addition flow with description', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Initially shows empty state
        expect(screen.getByText('No todos yet. Add your first todo above!')).toBeInTheDocument();

        // Add a todo with description
        await user.type(screen.getByRole('textbox', { name: /todo name/i }), 'Todo with description');
        await user.type(screen.getByRole('textbox', { name: /todo description/i }), 'This is a test description');
        await user.click(screen.getByRole('button', { name: /add todo/i }));

        // Todo should appear in the list with description
        await waitFor(() => {
            expect(screen.getByText('Todo with description')).toBeInTheDocument();
            expect(screen.getByText('This is a test description')).toBeInTheDocument();
        });

        expect(screen.getByText('Your Todos')).toBeInTheDocument();
        expect(screen.getByText('1 todo')).toBeInTheDocument();

        // Form should be cleared
        expect(screen.getByRole('textbox', { name: /todo name/i })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: /todo description/i })).toHaveValue('');
    });
});
