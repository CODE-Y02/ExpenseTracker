// get user expense

module.exports.getExpenses = (req, where) => {
  /**
   * req --> instance of  user model
   * where --> where obj ex-> { where : { id: userId ,  name: "abc"}}
   */

  return req.user.getExpenses(where);
};

module.exports.getDownloads = (req, where) => {
  return req.user.getDownloads(where);
};


