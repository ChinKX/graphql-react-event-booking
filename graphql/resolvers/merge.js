const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const DataLoader = require('dataloader');

let eventLoader;
let userLoader;

// 1. DataLoader needs an array of identifiers
// 2. Merge all the identifiers received within single tick of event loop
// 3. Make a batch request and then split the results for diff parts of the app
// NOTE: Reinitialize data loaders to prevent from accessing outdated cache
const createDataLoaders = () => {
  eventLoader = new DataLoader(eventIds => {
    return events(eventIds);
  });

  userLoader = new DataLoader(userIds => {
    return User.find({ _id: { $in: userIds } });
  });
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort(
      (a, b) =>
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
    );
    return events.map(event => transformEvent(event));
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () =>
        eventLoader.loadMany(
          user._doc.createdEvents.map(eventId => eventId.toString())
        )
    };
  } catch (error) {
    throw error;
  }
};

const event = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: event.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

// exports.user = user;
// exports.events = events;
// exports.event = event;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.createDataLoaders = createDataLoaders;
