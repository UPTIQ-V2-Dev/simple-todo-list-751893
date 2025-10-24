import { useState, useCallback } from 'react';
import { Todo } from '@/types/todo';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = useCallback(
        (name: string) => {
            const trimmedName = name.trim();

            if (!trimmedName) {
                throw new Error('Todo name cannot be empty');
            }

            // Prevent duplicate todo names
            const isDuplicate = todos.some(todo => todo.name.toLowerCase() === trimmedName.toLowerCase());

            if (isDuplicate) {
                throw new Error('Todo with this name already exists');
            }

            const newTodo: Todo = {
                id: crypto.randomUUID(),
                name: trimmedName,
                createdAt: new Date()
            };

            setTodos(prevTodos => [newTodo, ...prevTodos]);
        },
        [todos]
    );

    return {
        todos,
        addTodo
    };
};
