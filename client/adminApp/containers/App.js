import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../redux/actions'
import Users from './Users'
import Operations from './Operations'
import Console from './Console'
import Header from '../components/Header'

// import TodoInput from '../components/TodoInput'
// import TodoList from '../components/TodoList'

// <TodoInput addTodo={this.props.actions.addTodo} />
// <TodoList todos={this.props.todos} actions={this.props.actions} />
var App = React.createClass({
  render: function() {
    return (
      <div className="container-fluid" style={{height:"100%"}}>
        <div className="row" style={{height:"5%", minHeight:"40px"}}>
          <Header />
        </div>
        <div className="row" style={{height:"65%"}}>
          <Users users={this.props.users} socket={this.props.socket} actions={this.props.actions} />
          <Operations attacks={this.props.attacks} socket={this.props.socket} actions={this.props.actions}/>
        </div>
        <div className="row" style={{height:"30%"}}>
          <Console />
        </div>
      </div>
    )
  }
});

var mapStateToProps = function (state) {
  return state;
};

var mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);