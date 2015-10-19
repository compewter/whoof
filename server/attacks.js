module.exports.attacks = {

  'test': {
    name: 'test',

    description: "this is a sample attack module",

    //function to execute on client
    attack: function(){

      //result stores results of attack and is sent back by client
      //result is initialized client side
      result = {};//this must be named result in order to emit back the results properly
      result.name = "test"; //specify name of attack returning a result

      //perform attack logic
      var test = "test result value";
      console.log('executing test');
      var succesful = true;

      //handle results of the attack
      if(succesful){
        result.status = "Attack module executed successfully";
        //sometimes we will want to follow up with admin input
        result.followup = true;
        
        //use results to store content we would like to display to the admin
        result.results = {
          success: true,
          test: test
        }
      }else{
        result.status = "Attack module failed to execute successfully";
        result.followup = false;

        result.results = {
          success: false,
          reason: "Specify reason module failed"
        }
      }
    },

    //inputs are set with the admin web app attack form
    inputs:{
      input1: 'default value',
      input2: '',
      input3: '',
    },

    followup: {
      name: "test",
      attack: function(){

        result = {};

        var followupTest = "follow up test value";

        result.status = "Followup attack executed successfully";
        result.followup = false;

        result.results = {
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

  }

};
