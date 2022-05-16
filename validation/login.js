const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};
// vii. Setting up our API routes
// Now that we have validation handled, let’s create a new folder for our api routes and create a users.js file for registration and login.
// ➜ mern-auth mkdir routes && cd routes && mkdir api && cd api && touch users.js
// At the top of users.js, let’s pull in our required dependencies and load our input validations & user model.