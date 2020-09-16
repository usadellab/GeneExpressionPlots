import React from 'react';
//
import ReactLogo from './assets/logo.svg';
//
import './Home.css';

export default function DefaultHome() {
  return (
    <div className="App">
      <header className="App-header">
        <ReactLogo className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
