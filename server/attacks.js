module.exports.attacks = {

  'test': {
    name: 'test',

    description: 'this is a sample attack module',

    //function to execute on client
    attack: function(){

      //result stores results of attack and is sent back by client
      //result is initialized client side
      result = {};//this must be named result in order to emit back the results properly
      result.name = 'test'; //specify name of attack returning a result

      //perform attack logic
      var test = 'test result value';

      console.log('executing test');
      var succesful = true;

      //handle results of the attack
      if(succesful){
        result.status = 'Attack module executed successfully';
        //sometimes we will want to follow up with admin input
        result.followup = true;
        
        //use results to store content we would like to display to the admin
        result.results = {
          successful: true,
          test: test
        }
      }else{
        result.status = 'Attack module failed to execute successfully';
        result.followup = false;

        result.results = {
          successful: false,
          reason: 'Specify reason module failed'
        }
      }
    },

    //inputs are set with the admin web app attack form
    inputs:{
      input1: 'default value',
      input2: '',
      input3: ''
    },

    followup: {
      name: 'test',
      attack: function(){

        result = {};

        var followupTest = 'follow up test value';

        result.status = 'Followup attack executed successfully';
        result.followup = false;

        result.results = {
          successful : true,
          followupTest : followupTest
        };
      },

      //sometimes we need new inputs for the followup attack 
      //inputs are set with the admin web app attack form
      inputs:{
        input4: '',
        input5: ''
      }
    }

  },

  'redirect':{
    name: 'redirect',

    description: 'Redirect user to specified url',

    attack: function(){
      var result = {};
      result.name = 'redirect';

      result.status = 'Successfully exececuted redirect to ' + inputs.url;
      result.followup = false;

      //pop-up blockers will catch this:
      // var win = window.open(inputs.url, '_blank');
      // win.focus();

      result.results = {
        successful: true
      }

      //emit response before disconnecting client
      socket.emit('result', result);

      window.location.href = inputs.url;

    },

    inputs: {
      url: ''
    }

  }

};


var template = {
  name: '',

  description: '',

  //function to execute on client
  attack: function(){
    //result stores results of attack and is sent back by client
    //result is initialized client side
    var result = {}; //this must be named result in order to emit back the results properly
    result.name = ''; //specify name of attack returning a result

    //perform attack logic
    //use inputs object to set case by case variables


    //handle results of the attack
    result.status = '';
    //sometimes we will want to follow up with admin input
    result.followup = false;

    //use results to store content we would like to display to the admin
    result.results = {
      successful: false,
      reason: 'Specify reason module failed'
    }
  },

  //inputs are set with the admin web app attack form
  inputs: {

  },

  //if result.followup is set to true, it will execute this function on the client with optional follow up inputs
  //this needs to be the mongodb document id of another attack
  followup: "otherAttack._id"
}
