import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoFormSchema, TodoFormData } from '@/lib/validations';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface TodoFormProps {
    onSubmit: (name: string, description?: string) => void;
    existingTodos: Todo[];
}

export const TodoForm = ({ onSubmit, existingTodos }: TodoFormProps) => {
    const form = useForm<TodoFormData>({
        resolver: zodResolver(todoFormSchema),
        defaultValues: {
            name: '',
            description: ''
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

            onSubmit(data.name, data.description);
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
                className='space-y-4'
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Todo Name</FormLabel>
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
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Enter todo description...'
                                    {...field}
                                    aria-label='Todo description'
                                    rows={3}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    disabled={form.formState.isSubmitting}
                    className='w-full'
                >
                    Add Todo
                </Button>
            </form>
        </Form>
    );
};
