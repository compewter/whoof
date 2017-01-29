import React from 'react';
import Victims from './Victims';
import Attacks from './Attacks';
import io from 'socket.io-client'

const App = React.createClass({
  getInitialState: function () {
    return {
      victims: [],
      attacks: []
    };
  },
  componentDidMount: function() {
    let socket = io()
    socket.on('attacks', this._attacksReceived);
    socket.on('newUser', this._usersReceived);
    socket.emit('getAttacks')
    socket.emit('getUsers')
  },

  _attacksReceived: function(attacks){
    console.log(attacks)
    this.setState({ attacks })
  },

  _usersReceived: function(victim){
    console.log(victim)
    this.setState({ victims: this.state.victims.concat([victim]) })
  },

  render: function () {
    return (
      <div className='App'>
        <div className='ui text container'>
          <Victims
            victims={this.state.victims}
          />
          <Attacks
            attacks={this.state.attacks}
          />
        </div>
      </div>
    );
  },
});


// onFoodClick={
//   (idx) => (
//     this.setState({
//       selectedFoods: [
//         ...this.state.selectedFoods.slice(0, idx),
//         ...this.state.selectedFoods.slice(
//           idx + 1, this.state.selectedFoods.length
//         ),
//       ],
//     })
//   )
// }


// <FoodSearch
//   onFoodClick={
//     (food) => (
//       this.setState({
//         selectedFoods: this.state.selectedFoods.concat(food),
//       })
//     )
//   }
// />

export default App;
