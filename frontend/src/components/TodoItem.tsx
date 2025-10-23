import { Todo } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';

interface TodoItemProps {
    todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <Card>
            <CardContent className='p-4'>
                <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                        <h3 className='font-medium text-foreground'>{todo.name}</h3>
                        {todo.description && <p className='text-sm text-muted-foreground mt-1'>{todo.description}</p>}
                    </div>
                    <time
                        dateTime={todo.createdAt.toISOString()}
                        className='text-sm text-muted-foreground ml-4 shrink-0'
                    >
                        {formatDate(todo.createdAt)}
                    </time>
                </div>
            </CardContent>
        </Card>
    );
};
