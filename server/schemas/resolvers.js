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
        //
        me: async (parent, args, context) => {
            if (context.user) {
              const userInfo = await User.findOne({ _id: context.user._id });

            return userInfo;
            }
            throw new AuthenticationError('You need to be logged in!');
          },

    },
    Mutation: {
        // function to log in
        login: async (parent, { email, password}) => {
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
        // function to create a new user
        addUser: async (parent, {username,email,password}) => {
            // console.log('args',args);
            const user = await User.create({username,email,password});
            const token = signToken(user);
            
            return {
                
                token,
                user
            };
        },
        //had to do both the saveBook and deleteBook without the await in order to get them both to work
        //function to save a book to the database
        saveBook: async (parent, args, context) => {
            // console.log ('context',context.user)
            if (context.user) {
              return User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args } },
                { new: true, runValidators: true  }
              );
      
           
       
              }
            throw new AuthenticationError('You need to be logged in!');
          },
            //function to delete a book from the database
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId } } },
                    { new: true }
                  );
            }
            throw new AuthenticationError('You must be logged in to delete a book');
    }
}
};

module.exports = resolver;