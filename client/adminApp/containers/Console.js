import React, { Component } from 'react'

export default class Console extends Component {

	render() {
		let styles = {
			mainDiv: {
				backgroundColor: "#1c1c1c",
				color: "white",
				border: "solid 2px black",
				bottom: "0",
				height: "100%"
			},
			header: {
				fontSize: "14px"
			}
		};
		return (
			<div className="col-md-12" style={styles.mainDiv}>
				<h2 style={styles.header} >Console</h2>
			</div>
		);
	}

}
