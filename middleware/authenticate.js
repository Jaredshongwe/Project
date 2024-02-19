const User = require('../models/usersSchema');

const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json('you do not have access, please use /login page');
    }
    next();
};

const isAdmin = async (req, res, next) => {
    // Get the userId from the current user logged into the session
    const { displayName, emails } = req.session.user;
    const email = emails && emails.length > 0 ? emails[0].value : null;

    // Check if a user with the same username and email already exists
    const loggedInUser = await User.findOne({ $and: [{ username: displayName }, { email: email }] });

    if (!loggedInUser) {
        return res.status(401).json('You do not have access. Please create user.');
    }

    if (loggedInUser.role !== 'admin') {
        return res.status(403).json('You need to be an admin to perform this action.');
    }

    next();

};

module.exports = {
    isAuthenticated,
    isAdmin
}