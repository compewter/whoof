import React, { Component } from 'react'
import UserList from '../components/UserList'

export default class Users extends Component {
	componentDidMount() {
	  const {socket} = this.props;
	  socket.on('newUser', user =>
	    this.props.actions.addUser(user)
	  );
	  socket.emit('getUsers');
	}

	render() {
		let styles = {
			mainDiv: {
				backgroundColor: "#1c1c1c",
				color: "white",
				border: "solid 2px black",
				overflowY: "auto",
				height: "100%"
			},
			header: {
				fontSize: "14px"
			}
		}

		return (
			<div className="col-md-2" style={styles.mainDiv}>
				<h2 style={styles.header}>Users</h2>
				<div className="col-md-12">
					<UserList users={this.props.users} />
				</div>
			</div>
		)
	}

}
