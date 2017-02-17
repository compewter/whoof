import React, {Component, PropTypes} from 'react'

class Attack extends Component {
  render(){
    let attack = this.props.attack
    return(
      <tbody>
        <tr
          onClick={() => {this.props.toggleActive(attack)}}
          className={this.props.active ? 'title active' : 'title'}
        >
          <td>{attack.name}</td>
          <td>{attack.description}</td>
        </tr>
        {Object.keys(attack.inputs).map((inputName, indx)=>(
          <tr
            key={`attack_${this.props.index}_input_${indx}`}
            className={this.props.active ? 'content active' : 'content'}
          >
            <td>
              <label>{inputName}: </label>
              <input 
                type={attack.inputs[inputName].type || 'text'}
                onChange={(event)=>{this.props.updateInput({name: inputName, value: event.target.value, valid: event.target.checkValidity()})}}
                defaultValue={attack.inputs[inputName].defaultValue}
              />
            </td>
            <td>
              <span>{attack.inputs[inputName].description}</span>
            </td>
          </tr>
        ))}
        <tr
          key={`attack_${this.props.index}_execute`}
          className={this.props.active ? 'content active' : 'content'}
        >
          <td colSpan="2">
            <button 
              onClick={()=>{this.props.execute(attack)}}
              disabled={Object.keys(attack.inputs).some((input)=>{return !attack.inputs[input].valid})}
            >Execute</button>
          </td>
        </tr>
      </tbody>
    )
  }
}

Attack.propTypes = {
  index: PropTypes.number,
  active: PropTypes.bool,
  attack: PropTypes.object,
  toggleActive: PropTypes.func,
  updateInput: PropTypes.func,
  execute: PropTypes.func
}

export default Attack