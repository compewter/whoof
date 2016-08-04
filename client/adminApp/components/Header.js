import React, { Component } from 'react'

export default class Header extends Component {

	render() {
		let styles = {
			mainDiv: {
				backgroundColor: "#1c1c1c",
				color: "white",
				padding: "10px",
				top: "0",
				border: "solid 2px black"
			},
			header: {
				fontSize: "18px",
				margin: "0"
			}
		}

		return (
			<div style={styles.mainDiv}>
				<h1 style={styles.header} >VeAL</h1>
			</div>
		)
	}

}
