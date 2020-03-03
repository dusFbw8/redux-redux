
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'

// Defaults for the toggle namespace,
//   the defaults for input are defined in it's reducer
//   just to show you the difference
//   vv this is good style vv
const toggleDefaults = {value:false};

//  We create a store to connect a new state context to the reducer
//   - combineReducers is needed because we use 2 combineReducers
const store = createStore(
  combineReducers({
    toggle: toggleReducer, // creates a toggle:[default] key in your state
    input:  inputReducer   // creates an input:[default] key in your state
  })
  // If you wanted to define a default state for the application
  //   this is what you would have to do, its unflexible so we rather
  //   define the defaults states for the sub-states in the reducer itself.
  // ,{
  //     toggle:{value:false}
  //     input:{value:''},
  // }
);







// This function is responsible for managing the state
// - it is the single authority over the state
// - no other function should influence the state
// - it recieves messages (actions) and returns the new state
function toggleReducer(state=toggleDefaults,action){
  // We define the defaults here now beacuse it is more flexible
  switch (action.type){
    case 'on':  return {value:true};
    case 'off': return {value:false};
    default:    return state;
  }
}

// The connect function creates a new function (connector)
// - the connector is set up with the arguments we provided to connect
const toggleConnector = connect(
  mapToggleStateToProps,
  mapToggleActionsToProps
);

// [1] mapStateToProps: Takes data from state and filters out what we need
//   -
function mapToggleStateToProps(state){
  return {...state.toggle};
}

// [2] mapToggleActionsToProps: Takes action dispatchers and filters out what we need
function mapToggleActionsToProps(dispatch){
  // return {} // Send nothing to the component
  return {
    setOn:  function(){ dispatch({type:'on'}) },
    setOff: function(){ dispatch({type:'off'}) }
  }
}

// Calling the toggleConnector with the Toggle component will create a wrapped
//   version of the app component, thats why i call it ConnectedToggle here.
const ConnectedToggle = toggleConnector(
  // The actual Toggle component, it will not recieve redux-props unless connected
  function Toggle({value,setOn,setOff}){
    // we get [value] thanks to the mapStateToProps function
    // we get [setOn/setOff] thanks to the mapActionsToProps function
    function onToggle(){
        if ( value ) setOff()
        else         setOn()
      }
    return <button onClick={onToggle}>{JSON.stringify(value)}</button>;
  }
)






// This is a variation of the above to control an input fiels
//  - Observe the case where we catch the [off] action that was orignially
//    intended for the [toggle] namespace, this works, it's a feature
function inputReducer(state={value:""},action){
  switch (action.type){
    case 'off':    return {value:""}; // the input reducer can actually catch
                                      // this message, even though it's from toggle
    case 'clear':  return {value:""};
    case 'change': return {value:action.value};
    default:    return state;
  }
}

const inputConnector = connect(
  mapInputStateToProps,
  mapInputActionsToProps
);

function mapInputStateToProps(state){
  return {...state.input}
}

function mapInputActionsToProps(dispatch){
  return {
    clear:  function(){ dispatch({type:'clear'}) },
    change: function(value){ dispatch({type:'change',value}) }
  }
}

const ConnectedInput = inputConnector(
  function Input({value,change}){
    return <input value={value} onChange={e=>change(e.target.value)}/>;
  }
)

const ConnectedClearInput = inputConnector(
  function Input({clear}){
    return <button onClick={clear}>clear</button>;
  }
)

//  the Provider component makes our Redux store availabe to all the child
//   components that's why it is the outermost component here and gets the store
//   as a prop. ONLY components that have been connected can recieve the store!
ReactDOM.render(
  <Provider store={store}>
    <ConnectedToggle/>
    <ConnectedInput/>
    <ConnectedClearInput/>
  </Provider>
, document.getElementById('root'));
