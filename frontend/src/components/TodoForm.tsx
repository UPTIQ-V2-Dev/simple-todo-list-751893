import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoFormSchema, TodoFormData } from '@/lib/validations';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface TodoFormProps {
    onSubmit: (name: string) => void;
    existingTodos: Todo[];
}

export const TodoForm = ({ onSubmit, existingTodos }: TodoFormProps) => {
    const form = useForm<TodoFormData>({
        resolver: zodResolver(todoFormSchema),
        defaultValues: {
            name: ''
        }
    });

    const handleSubmit = (data: TodoFormData) => {
        try {
            // Check for duplicates
            const isDuplicate = existingTodos.some(todo => todo.name.toLowerCase() === data.name.toLowerCase());

            if (isDuplicate) {
                form.setError('name', {
                    type: 'manual',
                    message: 'Todo with this name already exists'
                });
                return;
            }

            onSubmit(data.name);
            form.reset();
        } catch (error) {
            form.setError('name', {
                type: 'manual',
                message: error instanceof Error ? error.message : 'An error occurred'
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='flex gap-2'
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormControl>
                                <Input
                                    placeholder='Enter todo name...'
                                    {...field}
                                    aria-label='Todo name'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    disabled={form.formState.isSubmitting}
                >
                    Add Todo
                </Button>
            </form>
        </Form>
    );
};
