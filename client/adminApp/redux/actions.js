var actions = {
  
  addUser: function (user) {
    return {
      type: 'ADD_USER',
      user: user
    };
  },

  addAttacks: function (attacks) {
    return {
      type: 'ADD_ATTACKS',
      attacks: attacks
    };
  }

};

module.exports = actions;