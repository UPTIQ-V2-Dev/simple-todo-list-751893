export interface Todo {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
}

export interface CreateTodoInput {
    name: string;
    description?: string;
}
