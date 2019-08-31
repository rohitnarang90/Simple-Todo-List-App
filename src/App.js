import React, { useReducer, useContext, useEffect, useRef } from 'react';
import './App.css';

function appReduceer(initialState, action) {
  switch (action.type) {

    case 'reset':{
      return action.payload;
    }

    case 'add': {
      return [...initialState,
      {
        id: Date.now(),
        text: "",
        completed: false
      }]
    }
    case 'delete': {
      return initialState.filter(item => item.id !== action.payload);
    }

    case 'completed': {
      return initialState.map(item => {
        if(item.id === action.payload){
          return {...item, completed: !item.completed};
        }
        return item;
      })
    }

    default: {
      return initialState;
    }
  }

}

const Context = React.createContext();

function App() {
  // const [[todo], SetTodo] = useState([]);
  const [state, dispatch] = useReducer(appReduceer, []);
  const initialLoad = useRef(false);

  // usecase of useRef.
  useEffect(()=> {
    if(!initialLoad.current){
      const appData = localStorage.getItem('data');
      dispatch({type:'reset', payload:JSON.parse(appData)})
      initialLoad.current = true;
    }
  });

  /* useEffect(()=> {
    const appData = localStorage.getItem('data');
    dispatch({type:'reset', payload:JSON.parse(appData)})
  }, []); */

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={dispatch}>
    <div>
      <h1>TODOs APP</h1>
      <button onClick={() => dispatch({ type: 'add' })}  >Add TODO </button>
      <br/>
      <br/>
      <TodoList items={state}/>
    </div>
    </Context.Provider>
  );
}

function TodoList({items}) {
  return items.map(item =><TodoItem key={item.id} {...item}/>);
}

function TodoItem({id, completed, text}){
  const dispatch = useContext(Context);
  return (
    // dispatch({type:'delete', payload:{id}})
  <div style={{width:'40%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
    <input type="checkbox" checked={completed} onChange={() => dispatch({type:'completed', payload:id})}/>
    <input type="text" defaultValue={text}/>
    <button onClick={() => dispatch({type:'delete', payload:id})}>Delete</button>
  </div>);
}

export default App;
