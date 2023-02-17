import { configureStore } from "@reduxjs/toolkit";
import TodoReducer from "./features/TodoSlice";

export default configureStore({
    reducer:{
        todo: TodoReducer
    }
})