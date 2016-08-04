import React, { Component } from 'react'
import AttackItem from './AttackItem'

//deleteTodo={this.props.actions.deleteTodo} 
// completeTodo={this.props.actions.completeTodo}
export default class AttackList extends Component {
	render() {
	  return (
	    <div>
	      {
	        this.props.attacks.map(function (attack) {
	          return (
	            <AttackItem 
	              key={attack.name} 
	              attack={attack} />
	          )
	        }.bind(this))
	      }
	    </div>
	  )
	}
}