import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const App = () => {
    const { todos, addTodo } = useTodos();

    const handleAddTodo = (name: string) => {
        addTodo(name);
    };

    return (
        <div className='min-h-screen bg-background p-4'>
            <div className='max-w-2xl mx-auto'>
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle className='text-center text-2xl font-bold'>Simple Todo App</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TodoForm
                            onSubmit={handleAddTodo}
                            existingTodos={todos}
                        />
                    </CardContent>
                </Card>

                <TodoList todos={todos} />
            </div>
        </div>
    );
};
