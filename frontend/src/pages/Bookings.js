import React, { Component } from 'react';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            event {
              _id
              title
              date
            }
            createdAt
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings, isLoading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {this.state.bookings.map(booking => (
              <li key={booking._id}>
                {booking.event.title} -{' '}
                {new Date(booking.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
