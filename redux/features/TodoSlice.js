import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import {v4 as uuidv4} from "uuid";


import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    setDoc
  } from "firebase/firestore";
  import { db, storage } from "../../config/firebase";
  import {ref, deleteObject} from 'firebase/storage';
  
// First, create the thunk
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "todos"));
      let todosList = [];
      querySnapshot.forEach((doc) => {
        todosList.push({
          name: doc.data()?.name,
          todoText: doc.data()?.todoText,
          status: doc.data()?.status,
          imgUrl: doc.data().imgUrl,
          id: doc.id
        });
      });
  
      console.log("Fetch todo Thunk method . . .", todosList);
      return todosList;
    } catch (error) {
      console.log("================catch====================");
      console.log(error);
      console.log("====================================");
    }
  });

  export const deleteTodos = createAsyncThunk('todos/deleteTodos',async (item)=>{
    try {
      const confirmed = window.confirm('Are you sure you want to delete this item?');
      if (!confirmed) {
        return null; // return null to indicate that no item was deleted
      }
        
        await deleteDoc(doc(db, "todos", item.id));
        var imgRef = ref(storage, item.imgUrl);
        await deleteObject(imgRef);
        return item
    } catch (error) {
       console.log("error", error);
        
    }

});

export const completeTodos = createAsyncThunk("todos/completeTodos", async (state) => {
  console.log(state)
  try {
    const docRef = doc(db, "todos", state.id);
    setDoc(docRef, state)
    return state

  } catch (error) {
    console.log(error);
  }
});


export const todoSlice = createSlice({
    name: "todo",
    initialState: {
        todos:[],
        filter: "All",
        loading: false,
        stateTriger: true,
        todo:{
          name: '',
          todoText: '',
          status: '',
          imgUrl:""
        }
    },
    reducers:{
        getTodo: (state, action)=> {
            state.todo = state.todos.find( (item)=>  item.id == action.payload )
        },
        addTodo: (state, action) => {
          console.log("add action",action.payload)
            const newTodo = { ...action.payload,  id: uuidv4() };
            state.todos = [ newTodo, ...state.todos ]
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter( (item) => item.id !== action.payload )
        },
        updateTodos: (state, action) => {
          console.log("update reducer",action.payload)
          state.stateTriger = true
            state.todos = state.todos.map( (item)=> item.id === action.payload.id ? action.payload : item )
        },
        setFilter: (state, action) =>{ 
            state.filter = action.payload
        }
    },

    extraReducers: (builder) => {

          builder.addCase(fetchTodos.pending, (state) => {
            state.loading = true;
            state.stateTriger = true
          });

          builder.addCase(fetchTodos.fulfilled, (state, action) => {
          state.loading = false;
          state.stateTriger = false;
          state.todos = action.payload;
          });

          builder.addCase(fetchTodos.rejected, (state) => {
            state.loading = false;
          });

          builder.addCase(deleteTodos.fulfilled, (state, action) => {
            const todos = state.todos;
            const item =  action.payload;
            state.todos = todos.filter((todo) => item.id !== todo.id)
          });    


          builder.addCase(completeTodos.fulfilled, (state, action) => {
            const todos = state.todos;
            state.todos = todos.map( (todo)=> todo.id === action.payload.id ? action.payload : todo )
          });    
    
      }

})

export const {addTodo, deleteTodo, getTodo, updateTodos, setFilter} = todoSlice.actions;

export default todoSlice.reducer;