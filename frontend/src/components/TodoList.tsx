import { Todo } from '@/types/todo';
import { TodoItem } from '@/components/TodoItem';

interface TodoListProps {
    todos: Todo[];
}

export const TodoList = ({ todos }: TodoListProps) => {
    if (todos.length === 0) {
        return (
            <div className='text-center py-8'>
                <p className='text-muted-foreground'>No todos yet. Add your first todo above!</p>
            </div>
        );
    }

    return (
        <div className='space-y-3'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold'>Your Todos</h2>
                <span className='text-sm text-muted-foreground'>
                    {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
                </span>
            </div>
            <div className='space-y-2'>
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                    />
                ))}
            </div>
        </div>
    );
};
