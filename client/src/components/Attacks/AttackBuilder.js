import React, {Component, PropTypes} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/java';
import 'brace/theme/monokai';

class AttackBuilder extends Component {
  componentDidMount() {
    this._prepare = `function prepare(params, logger){\n  logger("Preparing custom attack...");\n  return params;\n}`
    this._execute = `function execute(params){\n  params.time = new Date()\n  socket.emit("result", {\n    success: true,\n    message: "Successfully executed attack",\n    params\n  });\n}`
    this._followup = `function followup(params, logger){\n  logger("Successfully pwnd victim at " + params.time);\n}`
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

  _setPrepare = (newValue)=>{
    console.log(newValue)
    this._prepare = newValue
  }

  _setExecute = (newValue)=>{
    this._execute = newValue
  }

  _setFollowup = (newValue)=>{
    this._followup = newValue
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
        <tr className={this.props.active ? 'content active' : 'content'}>
          <td>
            <h5>Prepare:</h5>
            <br></br>
            <p>
              This function is used to programatically prepare any data for the attack function.<br></br>
              Add any data you need to the params object.<br></br>
              The values of user inputs are attached to the params argument.<br></br>
              The logger argument is provided for printing information.<br></br>
              You must return the params object.
            </p>
          </td>
          <td>
            <AceEditor
              mode="javascript"
              theme="monokai"
              name="attack-prep-ta"
              height='300px'
              tabSize={2}
              onChange={this._setPrepare}
              editorProps={{$blockScrolling: true}}
              value={this._prepare}
            />
          </td>
        </tr>
        <tr className={this.props.active ? 'content active' : 'content'}>
          <td>
            <h5>Execute:</h5>
            <br></br>
            <p>
              This function is executed in the victim's browser.<br></br>
              The params argument is configured in the prepare function.<br></br>
              If you do not emit a result with the victim's socket the attacker's console will not know the status of the executed function- e.g.,<br></br>
              socket.emit("result", {'{'}<br></br>
                &nbsp;&nbsp;success: true<br></br>
                &nbsp;&nbsp;message: "Successfully executed attack",<br></br>
                &nbsp;&nbsp;params: params<br></br>
              });
            </p>
          </td>
          <td>
            <AceEditor
              mode="javascript"
              theme="monokai"
              name="attack-execute-ta"
              height='300px'
              onChange={this._setExecute}
              tabSize={2}
              editorProps={{$blockScrolling: true}}
              value={this._execute}
            />
          </td>
        </tr>
        <tr className={this.props.active ? 'content active' : 'content'}>
          <td>
            <h5>Followup:</h5>
            <br></br>
            <p>
              This function is executed on the attackers side when the victim's socket emit's a result.<br></br>
              The params argument is the one returned by the attack execute function.<br></br>
            </p>
          </td>
          <td>
            <AceEditor
              mode="javascript"
              theme="monokai"
              name="attack-execute-ta"
              height='300px'
              onChange={this._setFollowup}
              tabSize={2}
              editorProps={{$blockScrolling: true}}
              value={this._followup}
            />
          </td>
        </tr>
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