export default {
  victims: {
    activeTargets: {},
    victims: {},
    victimIdBySocketIdMap: {}
  },
  attacks: {
    attacks: [],
    visibleAttacks: {},
    activeAttack: {
      id: null
    },
    exampleAttack: {
      id: 'new',
      name: 'Attack Builder',
      description: 'Template for building a new attack.',
      'inputs': {
        'example input name':{
          name: 'example input name',
          description: 'example description',
          defaultValue: 'example default value',
          type: 'text'
        }
      },
      'prepare': {
        name: 'prepare',
        description: 'This function is used to programatically prepare any data for the execute function.\nAdd any data you need to the params object.\nUser inputs are automatically attached to the params argument.\nThe logger argument is provided for printing information.\nYou must return the params object.',
        function: 'function prepare(params, logger){\n  //associate any necessary data to params\n  return params;\n}'
      },
      'execute': {
        name: 'execute',
        description: 'This function is executed in the victim\'s browser.\nThe params argument is configured in the prepare function.\nIf you do not emit a result with the victim\'s socket the attacker\'s console will not know the status of the executed function- e.g.,\nsocket.emit("result", {\n  success: true\n  message: "Successfully executed attack",\n  params: params\n});',
        function: 'function execute(params){\n  try{\n    params.time = new Date();\n    socket.emit("result", {\n      success: true,\n      message: "Successfully executed attack",\n      params\n    });\n  }catch(e){\n    socket.emit("result", {\n      success: false,\n      message: "Attack failed: "+e,\n      params\n    });\n  }\n}'
      },
      'followup': {
        name: 'followup',
        description: 'This function is executed on the attackers side when the victim\'s socket emits a result.\nThe params argument is the one returned by the attack execute function.',
        function: 'function followup(params, logger){\n  //Follow up with another attack?\n}'
      },
      pending: {
        name: 'new',
        description: 'Template for building a new attack.',
        inputs: [],
        prepare: {
          name: 'prepare'
        },
        execute: {
          name: 'execute'
        },
        followup: {
          name: 'followup'
        }
      }
    },
    followupBuffer: {}
  },
  terminal: {
    logger: console.log
  },
  login: {
    authorized: false
  }
}
