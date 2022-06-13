// exporting auth middleware
module.exports = (req, res, next) => {
  // checking if user is authenticated
  console.log("inn");
  if (req.isAuthenticated()) {
    if (req.user.role !== "admin") {
      return next();
    }
  } else {
    res.json({ error: "Authenctication Failed" });
  }
};
