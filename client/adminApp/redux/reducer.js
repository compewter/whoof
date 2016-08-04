var reducer = function (state, action) {
  
  switch (action.type) {

    case 'ADD_USER':
      return Object.assign({}, state, {
        users: [{
          ip: action.user.ip,
          agent: action.user.agent,
          connectedAt: action.user.connectedAt
        }, ...state.users]
      });

    case 'ADD_ATTACKS':
      return Object.assign({}, state, {
        attacks: action.attacks
      });

    case 'COMPLETE_TODO':
      console.log(action.id);
      return Object.assign({}, state, {
        todos: state.todos.map(function (todo) {
          return todo.id === action.id ? 
            Object.assign({}, todo, {completed: !todo.completed}) : 
            todo
        })
      });

    default: 
      return state;
  }
};

module.exports = reducer;