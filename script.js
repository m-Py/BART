$(document).ready(function() { 

  // initialize
  
  var round = 0;
  var start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
  var increase = 2; // number of pixels by which balloon is increased each pump
  var size; // start_size incremented by 'increase'
  var pumps; 
  var total = 0; // money that has been earned in total (in several rounds)
  var money = 0; // money that has been earned in a single round
  var array; // will be used to determine the explosion point of the balloon
  var array_rand; // numbers are drawn from this array; it is filled in the 'new_sequence' function
  
  $('#press').html('Pumpen'); 
  $('#collect').html('Geld einsammeln');

  // function to create an array determining the break point of the ballon; balloon explodes when number 1 is drawn from the array
  var new_sequence = function() {

    // create array containing the numbers 1:128
    array = [];
    for (var i = 1; i <= 128; i++) { // insert number of maximum pumps here
      array.push(i);
    }

    // randomize array sequence
    array_rand = [];
  
    for (var i = 0; i < array.length; i++) {
      if (array_rand.length === 0) {
	var rnd = Math.floor(Math.random()*array.length)+1;
	array_rand.push(rnd);
      }
      else if (array_rand.length > 0) {
	var rnd = Math.floor(Math.random()*array.length)+1;
	while (array_rand.indexOf(rnd) != -1) { 
	  var rnd = Math.floor(Math.random()*array.length)+1;
	}
	array_rand.push(rnd);
      }
    }
  };


  // what happens when a new round starts
  var new_round = function() {
    round += 1;
    size = start_size;
    pumps = 0;
    new_sequence();
    $('#ballon').width(size); 
    $('#ballon').height(size);
    $('#ballon').show()
    $('#round').html('<h2>Ballon Spiel Runde '+round+'<h2>');
    $('#money').html('Guthaben: '+money.toFixed(2)+' Euro');
    $('#pumps').html(pumps+' Mal gepumpt');
    $('#total').html('Gesamtguthaben: '+total.toFixed(2)+' Euro');
  };
  
  
  // text that is shown when a round ends...
  // ...if the balloon explodes
  var explosion = function() {
    $('#explode').html('<h2>Der Ballon ist explodiert und das erspielte Geld verloren!<br />Die nächste Runde startet.</h2>').show().delay(2000).hide(0);
  }
  
  // ... if the money is collected before it explodes
  var collected = function() {
    $('#explode').html('<h2>Das erspielte Geld ist sicher in der Bank.<br />Die nächste Runde startet.</h2>').show().delay(2000).hide(0);
  }
   
  // start the game!
  new_round();
  
  $("#press").click(function() {
    if (pumps < array_rand.indexOf(1)+1) { // pumping is only clickable until the balloon explodes
      
      if (array_rand[pumps] === 1) { // what happens if the balloon explodes
        money = 0;
        pumps += 1;
        $('#pumps').html(pumps+' Mal gepumpt');
        $('#money').html('Guthaben: '+money.toFixed(2)+' Euro');
        $('#ballon').fadeOut('slow');
        setTimeout(explosion, 1100);
        setTimeout(new_round, 3500);
      }
      
      else { // if balloon does not explode
	size += increase;
	pumps += 1; 
	money += 0.05;
	$('#ballon').width(size); 
	$('#ballon').height(size);
	$('#pumps').html(pumps+' Mal gepumpt');
	$('#money').html('Guthaben: '+money.toFixed(2)+' Euro'); 
      }
    }
  });

  $('#collect').click(function() {
    if (pumps < array_rand.indexOf(1)+1) {
      if (pumps > 0) {
        pumps = 0;
	total += money;
	money = 0;
	$('#ballon').hide();
        collected();
        setTimeout(new_round, 2000);
      }
    }
  });

});

