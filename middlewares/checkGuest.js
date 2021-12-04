// exporting auth middleware
module.exports = (req, res, next) => {
  // checking if user is authenticated
  if (req.session.guestUser) {
    return next();
  } else {
    res.json({ error: "Authenctication Failed" });
  }
};
