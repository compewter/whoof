import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { Container, Form, Header } from 'semantic-ui-react'

import * as loginActions from '../../actions/login';

class Login extends Component {

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  _login = ()=>{
    this.props.socket.emit('login', this.state.password)
  }

  componentDidMount() {
    this.state = {
      password: ''
    }
  }

  render() {
    return (
      <Container>
        <Header as="h1">Login Required</Header>
        <Form onSubmit={this._login}>
          <Form.Input label="Password" type="password" name="password" onChange={this.handleChange}/>
          <Form.Button>Submit</Form.Button>
        </Form>
      </Container>
    )
  }
}

Login.propTypes = {
  socket: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  return {
    authorized: state.login.authorized
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
