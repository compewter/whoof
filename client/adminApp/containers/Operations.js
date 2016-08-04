import React, { Component } from 'react'
import AttackList from '../components/AttackList'

export default class Operations extends Component {
	componentDidMount() {
	  const {socket} = this.props;
	  socket.on('attacks', attacks =>
	    this.props.actions.addAttacks(attacks)
	  );
	  socket.emit('getAttacks');
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
			},
			subHeader: {
				fontSize: "13px"
			}
		};
		return (
			<div className="col-md-10" style={styles.mainDiv}>
				<h2 style={styles.header}>Operations</h2>
				<div className="col-md-12">
					<h3 style={styles.subHeader}>Attacks</h3>
					<AttackList attacks={this.props.attacks} />
				</div>
			</div>
		);
	}

}