import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Search } from 'semantic-ui-react'

class AttackSearch extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps(nextProps, prevState){
    return {
      results: nextProps.attacks.map((attack)=>{
        let { description, id, name } = attack
        return {
          title: name,
          description,
          key: id,
          attack
        }
      }),
      value: ''
    }
  }

  _searchChange = (e, {value}) => {
    let { attacks } = this.props
    let results = []
    if (value === ''){
      results = attacks.map((attack)=>{
        let { description, id, name } = attack
        return {
          title: name,
          description,
          key: id,
          attack
        }
      })
    }else{
      results = attacks.reduce((_results, attack) => {
        if(attack.name.includes(value)){
          let { description, id, name } = attack
          _results.push({
            title: name,
            description,
            key: id,
            attack
          })
        }
        return _results
      }, [])
    }
    this.setState({
      results,
      value
    })
  }

  _resultSelect = (e, { result }) => {
    this.props.showAttack(result.key)
    this.props.toggleActive(result.attack)
  }

  render(){
    let { results, value } = this.state
    return(
      <Search
        id="attack-search-bar"
        fluid
        minCharacters={0}
        onResultSelect={this._resultSelect}
        onSearchChange={this._searchChange}
        results={results}
        value={value}
        style={{display: 'inline-block'}}
      />
    )
  }
}

AttackSearch.propTypes = {
  attacks: PropTypes.array.isRequired,
  showAttack: PropTypes.func.isRequired,
  toggleActive: PropTypes.func.isRequired
}

export default AttackSearch
