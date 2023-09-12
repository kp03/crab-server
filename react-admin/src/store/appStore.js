import { create } from 'zustand';
const appStore = (set) => ({
    token: null,
    setToken: (token) => {
        set((state) => {
            return ({
                token: token
            })
        })
    }
    // addTodoItem: (title) => {
    //     const newTodo = {
    //         title: title,
    //         completed: false,
    //     };
    //     set((state) => ({
    //         todos: [...state.todos, newTodo],
    //     }));
    // },
});
export const useAppStore = create(appStore);
