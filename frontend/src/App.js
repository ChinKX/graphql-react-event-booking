import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}
        >
          <MainNavigation />
          <main className='main-content'>
            <Switch>
              {/* Use exact to avoid infinite redirection loop i.e. only redirect when the exact path matches */}
              {!this.state.token && <Redirect from='/' to='/auth' exact />}
              {this.state.token && <Redirect from='/' to='/events' exact />}
              {this.state.token && <Redirect from='/auth' to='/events' />}
              {!this.state.token && <Route path='/auth' component={AuthPage} />}
              <Route path='/events' component={EventsPage} />
              {this.state.token && (
                <Route path='/bookings' component={BookingsPage} />
              )}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
