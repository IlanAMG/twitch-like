import React from 'react';
import './App.css';

import { Erreur } from './components/Erreur/Erreur';
import { Header } from './components/Header/Header';
import { Games } from './components/Games/Games';
import { GameStreams } from './components/GameStreams/GameStreams';
import { Live } from './components/Live/Live';
import { Resultats } from './components/Resultats/Resultats';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TopStreams } from './components/TopStreams/TopStreams';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <Router
      forceRefresh={true}
    >
      <div className="App">
        <Header />
        <Sidebar />

        <Switch>
          <Route exact path='/' component={Games} />
          <Route exact path='/top-streams' component={TopStreams} />
          <Route exact path='/live/:slug' component={Live} />
          <Route exact path='/game/:slug' component={GameStreams} />
          <Route exact path='/resultats/:slug' component={Resultats} />
          <Route exact path='/resultats' component={Erreur} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
