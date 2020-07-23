const authResolvers = require('./auth');
const eventsResolvers = require('./events');
const bookingsResolvers = require('./bookings');

const rootResolvers = {
  ...authResolvers,
  ...eventsResolvers,
  ...bookingsResolvers
};

module.exports = rootResolvers;
