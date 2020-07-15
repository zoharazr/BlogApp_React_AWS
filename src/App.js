import React from 'react';
import './App.css';
import DisplayPost from './components/DisplayPost'
import CreatePost from './components/CreatePost'
import { withAuthenticator } from 'aws-amplify-react'

function App() {
  return (
    <div className="App">
      <CreatePost/>
      <DisplayPost/>

    </div>
  );
}

export default withAuthenticator(App,
    {includeGreetings:true});
