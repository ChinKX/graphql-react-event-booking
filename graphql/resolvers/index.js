const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => ({
      ...event._doc,
      _id: event.id,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, event._doc.creator)
    }));
  } catch (error) {
    throw error;
  }
  // return Event.find({ _id: { $in: eventIds } })
  //   .then((events) =>
  //     events.map((event) => ({
  //       ...event._doc,
  //       _id: event.id,
  //       creator: user.bind(this, event._doc.creator)
  //     }))
  //   )
  //   .catch((error) => {
  //     throw error;
  //   });
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (error) {
    throw error;
  }
  // return User.findById(userId)
  //   .then((user) => ({
  //     ...user._doc,
  //     _id: user.id,
  //     createdEvents: events.bind(this, user._doc.createdEvents)
  //   }))
  //   .catch((error) => {
  //     throw error;
  //   });
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      // const events = await Event.find().populate('creator');
      return events.map(event => ({
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        // creator: {
        //   ...event._doc.creator._doc,
        //   _id: event._doc.creator.id,
        //   password: null
        // },
        creator: user.bind(this, event._doc.creator)
      }));
    } catch (error) {
      throw error;
    }
    // return (
    //   Event.find()
    //     // .populate('creator')
    //     .then((events) =>
    //       events.map((event) => ({
    //         ...event._doc,
    //         _id: event.id,
    //         // creator: {
    //         //   ...event._doc.creator._doc,
    //         //   _id: event._doc.creator.id,
    //         //   password: null
    //         // },
    //         creator: user.bind(this, event._doc.creator)
    //       }))
    //     )
    //     .catch((error) => {
    //       console.log(error);
    //       throw error;
    //     })
    // );
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5f187300c4973f55e076e169'
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById('5f187300c4973f55e076e169');
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (error) {
      throw error;
    }
    // return event
    //   .save()
    //   .then((result) => {
    //     createdEvent = {
    //       ...result._doc,
    //       _id: result.id,
    //       creator: user.bind(this, result._doc.creator)
    //     };
    //     return User.findById('5f18321e3e40295434f3f5a7');
    //   })
    //   .then((user) => {
    //     if (!user) {
    //       throw new Error('User not found.');
    //     }
    //     user.createdEvents.push(event);
    //     return user.save();
    //   })
    //   .then((_) => createdEvent)
    //   .catch((error) => {
    //     console.log(error);
    //     throw error;
    //   });
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user.save();
      return {
        ...result._doc,
        _id: result.id,
        password: null
      };
    } catch (error) {
      throw error;
    }
    // return User.findOne({ email: args.userInput.email })
    //   .then(user => {
    //     if (user) {
    //       throw new Error('User exists already');
    //     }
    //     return bcrypt.hash(args.userInput.password, 12);
    //   })
    //   .then(hashedPassword => {
    //     const user = new User({
    //       email: args.userInput.email,
    //       password: hashedPassword
    //     });
    //     return user.save();
    //   })
    //   .then(result => ({
    //     ...result._doc,
    //     _id: result.id,
    //     password: null
    //   }))
    //   .catch(error => {
    //     throw error;
    //   });
  }
};
