import React from 'react';
import './BookingsControls.css';

const BookingsControls = props => (
  <div className='bookings-control'>
    <button
      className={props.activeOutputType === 'list' ? 'active' : ''}
      onClick={props.onChange.bind(this, 'list')}
    >
      List
    </button>
    <button
      className={props.activeOutputType === 'chart' ? 'active' : ''}
      onClick={props.onChange.bind(this, 'chart')}
    >
      Chart
    </button>
  </div>
);

export default BookingsControls;
