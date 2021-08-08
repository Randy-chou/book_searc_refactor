const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Using the context we see if a token has tranted us a user_id to search for a User looking in.
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ username: context.user.username });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user with this email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });

            if (!user) {
                throw new AuthenticationError('addUser Failed?');
            }

            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true, runValidators: true }
                );
            }

            // If user attempts to execute this mutation and isn't logged in, throw an error
            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, {bookId}, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
            }
            return updatedUser;
        },
    },
};

module.exports = resolvers;