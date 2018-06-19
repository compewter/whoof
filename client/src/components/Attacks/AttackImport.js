import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Icon, Popup } from 'semantic-ui-react'


class AttackImport extends Component {
  _openFileDialog = ()=>{
    document.getElementById('attack-import-input').click()
  }

  _import = (e)=>{
    let {logger, save} = this.props
    let files = e.target.files
    for(let i = 0; i < files.length; i++){
      let fr = new FileReader();
      fr.onload = function(){
        let newAttack
        try{
          newAttack = JSON.parse(fr.result)
        }catch(e){
          logger('Failed to import attack. Error parsing file.')
          return
        }
        logger('Saving new attack: ' + newAttack.name)
        newAttack.id = 'new'
        save(newAttack)
      };
      fr.readAsText(files[i])
    }
  }

  render(){
    let {input, inputFields, update, del} = this.props
    return (
      <div className="attack-import">
        <Popup trigger={<Icon name="upload" id="attack-import" size="large" onClick={this._openFileDialog}/>} content="Import Attack" />
        <input id="attack-import-input" type="file" style={{display: 'none'}} accept=".json" onChange={this._import} multiple/>
      </div>
    )
  }
}

AttackImport.propTypes = {
  logger: PropTypes.func.isRequired
}

export default AttackImport