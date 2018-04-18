import React, {Component, PropTypes} from 'react'

class Attack extends Component {
  render(){
    let { active, activeAttack, defaultAttack, execute, index, toggleActive, toggleEdit, updateInput } = this.props
    return(
      <div className='ui segment'>
        <div
          onClick={() => {toggleActive(defaultAttack)}}
          className={`ui grid title ${active ? 'active' : ''}`}
        >
          <div className='four wide column'>
            <h4 className="capitalize">{defaultAttack.name}</h4>
          </div>
          <div className='twelve wide column'>
            <span>{defaultAttack.description}</span>
          </div>
        </div>

        <div className={`ui content segment secondary segments ${active ? 'active' : ''}`}>
          {Object.values(defaultAttack.inputs).map((input, indx)=>(
            <div key={`attack_${index}_input_${indx}`} className='ui secondary segment grid' >
              <div className='six wide column'>
                <label>{input.name}: </label>
                <input
                  className='ui input'
                  type={input.type || 'text'}
                  onChange={(event)=>{
                    updateInput({
                      attackId: defaultAttack.id,
                      name: input.name,
                      value: event.target.value,
                      valid: event.target.checkValidity()
                    })
                  }}
                  defaultValue={input.value}
                  style={{width:"90%"}}
                />
              </div>
              <div className='ten wide column'>
                <span>{input.description}</span>
              </div>
            </div>
          ))}

          <div className='ui secondary segment'>
            <button
              className="ui icon grey button"
              disabled={activeAttack.inputs && Object.values(activeAttack.inputs).some((input)=>{return !input.valid})}
              onClick={()=>{execute(activeAttack)}}
            ><i className="bomb icon"></i></button>
            <button
              className="ui icon grey button"
              onClick={()=>{toggleEdit(activeAttack)}}
            ><i className="edit icon"></i></button>
          </div>
        </div>
      </div>
    )
  }
}

Attack.propTypes = {
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  defaultAttack: PropTypes.object.isRequired,
  activeAttack: PropTypes.object,
  toggleActive: PropTypes.func.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  updateInput: PropTypes.func.isRequired,
  execute: PropTypes.func.isRequired
}

export default Attack