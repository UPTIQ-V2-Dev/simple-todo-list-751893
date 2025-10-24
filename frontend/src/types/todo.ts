export interface Todo {
    id: string;
    name: string;
    createdAt: Date;
}

export interface CreateTodoInput {
    name: string;
}
