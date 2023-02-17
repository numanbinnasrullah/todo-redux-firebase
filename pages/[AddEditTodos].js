import React, { useState, useEffect } from 'react';
import { addTodo } from "../redux/features/TodoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import Link from 'next/link';

import { collection, getDocs, addDoc, doc, deleteDoc, setDoc, Firestore, DocumentReference, DocumentData } from "firebase/firestore";
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import {getTodo, updateTodos} from '../redux/features/TodoSlice'
const initialState = {
  name: '',
  todoText: '',
  status: '',
  imgFile: null,
  imgUrl:""
};
const FormComponent = () => {
  const {todo} = useSelector( state => state.todo )
  console.log("Thuis is selected todo : ", todo)

  const [state, setState] = useState(initialState);
  const { name, todoText,  status, imgFile } = state;

  const dispatch = useDispatch();
  const router = useRouter()
  const id = router.query.AddEditTodos;

console.log(todo)
  useEffect( ()=>{
    dispatch(getTodo(id))
    setState({...todo})
  },[id, todo] )

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };
  
  const handleImageChange = (event) => {
    const { name } = event.target;
    setState({ ...state, [name]: event.target.files[0] });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (!name || !todoText || !status ) {
      alert("Please Fill the required fields")
  } else {
          try{ 
            if(id == "AddEditTodos"){
              var pathWhereImgAppend = `images/${imgFile.name}`
              const imgref = ref(storage, pathWhereImgAppend);
              await uploadBytes(imgref, imgFile);
              const geturl = await getDownloadURL(imgref);
              await addDoc(collection(db, "todos"), {name, todoText, status, imgUrl:geturl })
              dispatch(addTodo({name, todoText, status, imgUrl:geturl }));
              setTimeout( ()=> router.push('/'), 100 )
            } else {
               // check if a new image is selected for update
              if (imgFile) {
                var pathWhereImgAppend = `images/${imgFile.name}`
                const imgref = ref(storage, pathWhereImgAppend);
                await uploadBytes(imgref, imgFile);
                const geturl = await getDownloadURL(imgref);
                // state.imgUrl = geturl; // update the imgUrl field in the state object
                const docRef = doc(db, "todos", todo.id);
                await setDoc(docRef, {name, todoText, status, imgUrl:geturl })
                dispatch(updateTodos({name, todoText, status, imgUrl:geturl }))
                setTimeout( ()=> router.push('/'), 1000 )
              } else {
                const docRef = doc(db, "todos", todo.id);
                await setDoc(docRef, {name, todoText, status, imgUrl:todo.imgUrl })
                dispatch(updateTodos({name, todoText, status, imgUrl:todo.imgUrl }))
                setTimeout( ()=> router.push('/'), 1000 )
              }
            } 
          }catch(e){
              console.error("Error adding document: ", e);
          }
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' }}>
      <form onSubmit={handleSubmit} style={{ width: '80%', maxWidth: '500px', background: '#fff', padding: '20px', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', margin: '0 auto' }}>
        <div style={{ margin: '20px 0' , width: '80%'}}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            style={{ background: '#f2f2f2', color: '#333', padding: '10px', margin: '10px 0', width: '100%', borderRadius: '5px' }}
          />
        </div>

        <div style={{ margin: '20px 0', width: '80%' }}>
        <label htmlFor="todoText">Todo:</label>
          <textarea 
            id="todoText"
            name="todoText"
            value={todoText}
            onChange={handleInputChange}
            style={{ background: '#f2f2f2', color: '#333', padding: '10px', margin: '10px 0', width: '100%', borderRadius: '5px' }} rows="4" cols="47">
          
          </textarea>
        </div>
        
        <div style={{ margin: '20px 0' , width: '80%' }}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={handleInputChange}
            style={{ background: '#f2f2f2', color: '#333', padding: '10px', margin: '10px 0', width: '100%', borderRadius: '5px', boxSizing: 'border-box' }}
            >
              <option value="" disabled>Select Status</option>
              <option value="active" selected>Active</option>
              <option value="inactive" >Inactive</option>
            </select>
          </div>

          <div style={{ margin: '20px 0', width: '80%' }}>
          <label htmlFor="imgFile">Select An Image:</label>
          <input
            type="file"
            id="imgFile"
            name="imgFile"
            onChange={handleImageChange}
            style={{ background: '#f2f2f2', color: '#333', padding: '10px', margin: '10px 0', width: '100%', borderRadius: '5px' }}
          />
        </div>

          <button type="submit" style={{ background: '#0f2027', color: '#fff', padding: '10px 20px', margin: '20px 0', borderRadius: '5px', cursor: 'pointer', width: '80%' }} >
           {id == "AddEditTodos" ? "Save" : "Update"}
          </button>

          <button type="submit" style={{ background: '#0f2027', color: '#fff', padding: '10px 20px', margin: '20px 0', borderRadius: '5px', cursor: 'pointer', width: '80%' }}>
          <Link href="/" style={{ color: "white", textDecoration:"none" }}>Back To Home</Link>
          </button>
        </form>
      </div>
    );
  };
  
  export default FormComponent;
  