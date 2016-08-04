import React, { Component } from 'react'

export default class AttackItem extends Component {
  render() {
    let styles = {
      mainDiv: {
        fontSize: "12px",
        border: "1px solid black"
      },
      name: {
        marginBottom: "0"
      },
      description: {
        fontSize: "10px",
        paddingLeft: "4px"
      }
    };

    return (  
      <div style={styles.mainDiv}>
        <p style={styles.name}>{this.props.attack.name}</p>
        <p style={styles.description}>{this.props.attack.description}</p>
      </div>
    );
  }
}