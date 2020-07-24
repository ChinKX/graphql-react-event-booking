import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main className='main-content'>
        <Switch>
          {/* Use exact to avoid infinite redirection loop i.e. only redirect when the exact path matches */}
          <Redirect from='/' to='/auth' exact />
          <Route path='/auth' component={AuthPage} />
          <Route path='/events' component={EventsPage} />
          <Route path='/bookings' component={BookingsPage} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
