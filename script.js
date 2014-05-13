$(document).ready(function() { 

  // initialize variables
  
  var increase = 2; // number of pixels by which balloon is increased each pump
  var start_size = 150; // start value of widht & height of the image
  var total = 0; // money that was earned in total
  var size; 
  var pumps;
  var money = 0; // money earned in a single roung
  var array; 
  var array_rand;
  var round = 0;


  // function to create an array determining the break point of the ballon
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
    $('#total').html('Gesamtguthaben: '+total.toFixed(2)+' Euro');    
    new_sequence();
    console.log(array_rand);
    $('#ballon').width(size); 
    $('#ballon').height(size);
    $('#ballon').show()
    $('#round').html('<h2>Ballon Spiel Runde '+round+'<h2>');
    $('#money').html('Guthaben: '+money.toFixed(2)+' Euro');
    $('#pumps').html('0 Mal gepumpt');    
  };
  
  
  // Text, der gezeigt wird, wenn Ballon explodiert
  var explosion = function() {
    $("#explode").html('<h2>Der Ballon ist explodiert und das erspielte Geld verloren!<br />Die nächste Runde startet.</h2>').show().delay(2000).hide(0);
  }
  
  // Text, der gezeigt wird, wenn freiwillig abgebrochen wird
  var collected = function() {
    $("#explode").html('<h2>Das erspielte Geld ist sicher in der Bank.<br />Die nächste Runde startet.</h2>').show().delay(2000).hide(0);
  }
   
  // start the game!
  new_round();
  
  $("#press").click(function() {
    if (pumps < array_rand.indexOf(1)+1) { // nur so lange bis der Ballon platzt
      
      if (array_rand[pumps] === 1) { // was passiert, wenn der Ballon platzt
      money = 0;
      pumps += 1;
      $('#pumps').html(pumps+' Mal gepumpt');
      $('#money').html('Guthaben: '+money.toFixed(2)+' Euro');
      $("#ballon").hide('explode', {pieces: 32}, 1000);
      setTimeout(explosion, 1100);
      setTimeout(new_round, 3500);
      }
      
      else { // wenn der Ballon nicht platzt
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

  $("#collect").click(function() {
    if (pumps < array_rand.indexOf(1)+1) {
      if (pumps > 0) {
        pumps = 0;
	total += money;
	money = 0;
	$("#ballon").hide();
        collected();
        setTimeout(new_round, 2000);
      }
    }
  });

});


// TO DO: "Pumpen" Schaltfläche darf nicht den Pump-Counter erhöhen, wenn man gerade das Geld eingesammelt hat

