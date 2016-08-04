module.exports = function(){

  //result stores results of attack and is sent back by client
  //result is initialized client side outside of this function
  
  result = {};//this must be named result in order to emit back the results properly
  result.name = 'test'; //specify name of the attack returning this result

  //perform attack logic
  var value = 'test result value';

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
      value: value
    }
  }else{
    result.status = 'Attack module failed to execute successfully';
    result.followup = false;

    result.results = {
      successful: false,
      reason: 'Specify reason module failed'
    }
  }
}