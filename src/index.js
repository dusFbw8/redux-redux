
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore       } from 'redux'
import { Provider, connect } from 'react-redux'

// This is the default state for our Redux, without it our state
// inside the reducer would be empty, this may caus trouble
const defaults = {value:false}

//  We create a store to connect a new state context to the reducer
const store = createStore(reducer,defaults);

// This function is responsible for managing the state
// - it is the single authority over the state
// - no other function should influence the state
// - it recieves messages (actions) and returns the new state
function reducer(state,action){
  switch (action.type){
    case 'on':  return {value:true};
    case 'off': return {value:false};
    default:    return state;
  }
}

// The connect function creates a new function (connector)
// - the connector is set up with the arguments we provided to connect
const connector = connect(
  mapStateToProps,
  mapActionsToProps
);

// [1] mapStateToProps: Takes data from state and filters out what we need
function mapStateToProps({value}){
  // return {} // Send nothing to the component
  // return state // This will send everything from state to the component
  return { value };
}

// [2] mapActionsToProps: Takes action dispatchers and filters out what we need
function mapActionsToProps(dispatch){
  // return {} // Send nothing to the component
  return {
    setOn:  function(){ dispatch({type:'on'}) },
    setOff: function(){ dispatch({type:'off'}) }
  }
}

// Calling the connector with the App component will create a wrapped
//   version of the app component, thats why i call it ConnectedApp here.
const ConnectedApp = connector(
  // The actual App component, it will not recieve redux-props unless connected
  function App({value,setOn,setOff}){
    // we get [value] thanks to the mapStateToProps function
    // we get [setOn/setOff] thanks to the mapActionsToProps function
    function toggle(){
        if ( value ) setOff()
        else         setOn()
      }
    return <button onClick={toggle}>{JSON.stringify(value)}</button>;
  }
)

//  the Provider component makes our Redux store availabe to all the child
//   components that's why it is the outermost component here and gets the store
//   as a prop. ONLY components that have been connected can recieve the store!
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>
, document.getElementById('root'));
