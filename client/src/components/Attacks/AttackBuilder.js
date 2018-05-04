import React, {Component} from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import AttackInputs from './AttackInputs'
import 'brace/mode/java';
import 'brace/theme/monokai';

class AttackBuilder extends Component {
  _execute = ()=>{
    let {attack, execute} = this.props
    Object.keys(attack.inputs).forEach((name)=>{
      attack.inputs[name].value = attack.inputs[name].defaultValue        
    })
    execute(attack)
  }

  _updateInput = (field, inputName, value)=>{
    let {attack, logger, update} = this.props
    let tempAttack = Object.assign({}, attack)
    if(field === 'name'){
      if(!tempAttack.inputs[value]){
        tempAttack.inputs[value] = tempAttack.inputs[inputName]
        tempAttack.inputs[value][field] = value
        delete tempAttack.inputs[inputName]
      }else if(inputName !== value){
        logger('input name already used')
      }
    }else{
      tempAttack.inputs[inputName][field] = value
    }
    update(tempAttack)
  }

  _delete = ()=>{
    if(confirm('Delete this attack?')){
      this.props.delete(this.props.attack.id)
    }
  }

  _deleteInput = (inputName)=>{
    let {attack, update} = this.props
    let tempAttack = Object.assign({}, attack)
    delete tempAttack.inputs[inputName]
    update(tempAttack)
  }

  _save = ()=>{
    this.props.save(this.props.attack)
  }

  render(){
    let { attack, active, toggleActive, update } = this.props
    let inputs = Object.values(attack.inputs).map((input) => (
      <AttackInputs
        key={`input_${attack.name}_${input.name}`}
        input={input}
        inputFields={[
          {label:'Name', key:'name'},
          {label:'Description', key:'description'},
          {label:'HTML Type', key:'type'},
          {label:'Default Value', key:'defaultValue'}
        ]}
        del={this._deleteInput}
        update={this._updateInput}
      />
    ))

    return(
      <div className="ui segment">
        <div
          onClick={() => {toggleActive({id: 'builder'})}}
          className={`ui grid title ${active ? 'active' : ''}`}
        >
          <div className='four wide column'>
            <h4 className='capitalize'>{attack.id === 'builder' ? 'Attack Builder' : attack.name}</h4>
          </div>
          <div className='twelve wide column'>
            <span>{attack.id === 'builder' ? 'Template for building a new attack.' : attack.description}</span>
          </div>
        </div>

        <div className={`ui content segment secondary segments ${active ? 'active' : ''}`}>
          <div className={`ui secondary segment grid ${active ? 'active' : ''}`}>
            <div className='six wide column'>
              <h5>Describe:</h5>
              <p>Set a name and brief description of this attack</p>
            </div>

            <div className="ten wide column grid">
              <div className="row" style={{paddingBottom: "1em"}}>
                <div className="ui labeled input">
                  <div className="ui label">
                    Name
                  </div>
                  <input
                    type="text"
                    defaultValue={attack.name}
                    onBlur={(event)=>{
                      let newValue = event.target.value
                      let tempAttack = Object.assign({}, attack)
                      tempAttack.name = newValue
                      update(tempAttack)
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="ui labeled input">
                  <div className="ui label">
                    Description
                  </div>
                  <textarea
                    type="text"
                    defaultValue={attack.description}
                    style={{width: "400px", height: "50px"}}
                    onBlur={(event)=>{
                      let newValue = event.target.value
                      let tempAttack = Object.assign({}, attack)
                      tempAttack.description = newValue
                      update(tempAttack)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`ui secondary segment grid ${active ? 'active' : ''}`}>
            <div className='six wide column'>
              <h5>Inputs:</h5>
              <p>User inputs to be set before launching an attack</p>
            </div>
            <div id="ab-inputs" className='ten wide column center aligned'>
              {inputs}
              <button
                className="compact circular ui icon button"
                onClick={()=>{
                  let tempAttack = Object.assign({}, attack)
                  if(!tempAttack.inputs['']){
                    tempAttack.inputs[''] = {
                      name: '',
                      defaultValue: ''
                    }
                    update(tempAttack)
                  }
                }}
              ><i className="add circle icon"></i></button>
            </div>
          </div>

          {[attack.prepare, attack.execute, attack.followup].map((attackFunction)=>{
            return (
              <div key={`ab_${attackFunction.name}`} className={`ui secondary segment grid content ${active ? 'active' : ''}`} >
                <div className='six wide column'>
                  <h5 className="capitalize">{attackFunction.name}:</h5>
                  <br></br>
                  <p>{attackFunction.description}</p>
                </div>
                <div className='ten wide column'>
                  <AceEditor
                    mode="javascript"
                    theme="monokai"
                    name="attack-prep-ta"
                    height='300px'
                    width='600px'
                    tabSize={2}
                    onChange={(newValue)=>{
                      let tempAttack = Object.assign({}, attack)
                      tempAttack[attackFunction.name].function = newValue
                      update(tempAttack)
                    }}
                    editorProps={{$blockScrolling: true}}
                    value={attackFunction.function}
                  />
                </div>
              </div>
            )
          })}

          <div className={active ? 'content active' : 'content'}>
            <div colSpan="2">
              <button
                className="ui icon button"
                onClick={this._execute}
              ><i className="bomb icon"></i></button>
              <button
                className="ui icon button"
                onClick={this._save}
              ><i className="save icon"></i></button>
              {
                attack.id !== 'builder' ?
                <div
                  className="ui icon button"
                  data-tooltip="Delete this attack"
                  onClick={this._delete}
                ><i className="trash icon"></i></div>
              :''}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AttackBuilder.propTypes = {
  active: PropTypes.bool.isRequired,
  attack: PropTypes.object.isRequired,
  toggleActive: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  execute: PropTypes.func.isRequired,
  logger: PropTypes.func.isRequired
}

export default AttackBuilder