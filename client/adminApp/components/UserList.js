import React, { Component } from 'react'
import UserItem from './UserItem'

//deleteTodo={this.props.actions.deleteTodo} 
// completeTodo={this.props.actions.completeTodo}
export default class UserList extends Component {
	render() {
	  return (
	    <div>
	      {
	        this.props.users.map(function (visitor) {
	          return (
	            <UserItem 
	              key={visitor.ip} 
	              visitor={visitor} />
	          )
	        }.bind(this))
	      }
	    </div>
	  )
	}
}