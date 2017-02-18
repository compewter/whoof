import React, {Component, PropTypes} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/java';
import 'brace/theme/monokai';

class AttackBuilder extends Component {
  componentWillMount() {
    this._functionDefaults = [
      {
        name: 'prepare',
        description: [
          'This function is used to programatically prepare any data for the execute function.',
          'Add any data you need to the params object.',
          'User inputs are attached to the params argument.',
          'The logger argument is provided for printing information.',
          'You must return the params object.'
        ],
        defaultValue: `function prepare(params, logger){\n  logger("Preparing custom attack...");\n  return params;\n}`
      },
      {
        name: 'execute',
        description: [
          'This function is executed in the victim\'s browser.',
          'The params argument is configured in the prepare function.',
          'If you do not emit a result with the victim\'s socket the attacker\'s console will not know the status of the executed function- e.g.,',
          'socket.emit("result", {',
          '  success: true',
          '  message: "Successfully executed attack",',
          '  params: params',
          '});'
        ],
        defaultValue: `function execute(params){\n  params.time = new Date();\n  socket.emit("result", {\n    success: true,\n    message: "Successfully executed attack",\n    params\n  });\n}`
      },
      {
        name: 'followup',
        description: [
          'This function is executed on the attackers side when the victim\'s socket emits a result.',
          'The params argument is the one returned by the attack execute function.'
        ],
        defaultValue: `function followup(params, logger){\n  logger("Successfully pwnd victim at " + params.time);\n}`
      }
    ]
  }

  _buildAttack = () => {
    this.props.logger('Building custom attack...')
    let attack = {
      prepare: this._prepare,
      execute: this._execute,
      followup: this._followup,
      inputs: {},
      name: 'custom'
    }
    this.props.execute(attack)
  }

  render(){
    return(
      <tbody>
        <tr
          onClick={() => {this.props.toggleActive({id: 'builder'})}}
          className={this.props.active ? 'title active' : 'title'}
        >
          <td>Attack Builder</td>
          <td>Build a custom attack</td>
        </tr>

        {this._functionDefaults.map((options)=>{
          this[`_${options.name}`] = options.defaultValue
          return (<tr className={this.props.active ? 'content active' : 'content'} key={`ab_${options.name}`}>
            <td>
              <h5 className="description-header">{options.name}:</h5>
              <br></br>
              <p>
                {options.description.map((line, idx)=>{
                  return <span key={`${options.name}_desc_${idx}`}>{line}<br></br></span>
                })}
              </p>
            </td>
            <td>
              <AceEditor
                mode="javascript"
                theme="monokai"
                name="attack-prep-ta"
                height='300px'
                tabSize={2}
                onChange={(newValue)=>{
                  this[`_${options.name}`] = newValue
                }}
                editorProps={{$blockScrolling: true}}
                value={this[`_${options.name}`]}
              />
            </td>
          </tr>)
        })}

        <tr className={this.props.active ? 'content active' : 'content'}>
          <td colSpan="2">
            <button 
              onClick={this._buildAttack}
              disabled={false}
            >Execute</button>
          </td>
        </tr>
      </tbody>
    )
  }
}

AttackBuilder.propTypes = {
  index: PropTypes.number,
  active: PropTypes.bool,
  attack: PropTypes.object,
  toggleActive: PropTypes.func,
  updateInput: PropTypes.func,
  execute: PropTypes.func,
  logger: PropTypes.func
}

export default AttackBuilder