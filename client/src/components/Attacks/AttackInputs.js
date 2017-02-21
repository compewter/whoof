import React, {Component, PropTypes} from 'react'

class AttackInputs extends Component {
  render(){
    let {input, inputFields, update, del} = this.props
    return (
      <div className="input-group ui grid segment" style={{paddingBottom: '1em'}}>
        <div className="ui fourteen wide column row">
          {inputFields.map((field)=>(
            <div className="ui eight wide column left aligned" style={{padding: '.5em'}} key={`input_${input.name}_${field.key}`}>
              <div className="ui labeled input">
                <div className="ui label">
                  {field.label}
                </div>
                <input
                  defaultValue={input[field.key]}
                  type="text"
                  onBlur={(event)=>{
                    update(field.key, input.name, event.target.value)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="ui two wide column middle aligned">
          <button 
            className="compact circular ui icon button"
            onClick={()=>{del(input.name)}}
          >
            <i className="remove circle icon"></i>
          </button>
        </div>
      </div>
    )
  }
}

AttackInputs.propTypes = {
  input: PropTypes.object,
  inputFields: PropTypes.array,
  update: PropTypes.func,
  del: PropTypes.func
}

export default AttackInputs