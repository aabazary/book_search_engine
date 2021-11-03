const {
    AuthenticationError
} = require('apollo-server-express');
const {
    User
} = require('../models');
const {
    signToken
} = require('../utils/auth');

const resolver = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
          },

    },
    Mutation: {
        login: async (parent, args, { email, password}) => {
            const user = await User.findOne({
                email
            });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return {
                token,
                user
            };
        },
        addUser: async (parent, args) => {
            const user = await User.create({args});
            const token = signToken(user);
            return {
                token,
                user
            };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate({
                    _id: user._id
                }, {
                    $addToSet: {
                        savedBooks: body
                    }
                }, {
                    new: true,
                    runValidators: true
                });
                return updatedUser;
            }
            throw new AuthenticationError('You must be logged in to save a book');
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                  );
                  if (!updatedUser) {
                    return updatedUser;

            }
            throw new AuthenticationError('You must be logged in to delete a book');
    }
}
}
};

module.exports = resolver;