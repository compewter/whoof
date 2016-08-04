import React, { Component, PropTypes } from 'react'

export default class UserItem extends Component {
  render() {
    let styles = {
      mainDiv: {
        fontSize: "12px",
        border: "1px solid black"
      },
      ip: {
        marginBottom: "0"
      },
      agent: {
        fontSize: "10px",
        paddingLeft: "4px"
      }
    }

    return (
      <div style={styles.mainDiv}>
        <p style={styles.ip}>{this.props.visitor.ip}</p>
        <p style={styles.agent}>{this.props.visitor.agent}</p>
      </div>
    )
  }
}