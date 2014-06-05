// pressure version of the BART

$(document).ready(function() { 


  var saveThis = 'hidden';
  
  // initialize values
  var round = 0;
  var start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
  var increase = 8; // number of pixels by which balloon is increased each pump
  var size; // start_size incremented by 'increase'
  var pumps; 
  var total = 0; // money that has been earned in total
  var rounds_played = 5;
  var array;
  var array_rand;
  var maximal_pumps = 30;
  
  // arrays for saving performance
  // number pumpings each round
  var number_pumps = [];

  // is balloon exploded
  var exploded = [];
  
  // initialize language
  
  var label_press = 'Druck in der Zuleitung erhöhen';
  var label_collect = 'Ballon aufpumpen';
  var label_balance = 'Gesamtguthaben:';
  var label_currency = ' Taler';
  var label_header = 'Ballon Spiel Runde ';
  var msg_explosion = '<h2>Der Ballon ist explodiert! Sie verdienen diese Runde kein Geld.<br />Die nächste Runde startet.</h2>';
  var msg_collect = '<h2>Das erspielte Geld ist sicher in der Bank.<br />Die nächste Runde startet.</h2>';
  var end_gratz = '<h2>Herzlichen Glückwunsch!</h2>';
  var msg_end1 = '<div style="margin-top:30px"><p>Sie haben im Ballon Spiel ';
  var msg_end2 = ' Taler Gewinn gemacht! Bevor das abschließende Quiz startet, bitten wir Sie zunächst noch einige Fragen zu beantworten.</p><p>Klicken Sie auf <i>Weiter</i>, um forzufahren.</p></div>';
  
  // initialize labels
  
  $('#press').html(label_press); 
  $('#collect').html(label_collect);
  $('#total_term').html(label_balance);

  // function to create an array determining the break point of the ballon; balloon explodes when number 1 is drawn from the array
  var new_sequence = function() {

    // create array containing the numbers 1:30
    array = [];
    for (var i = 1; i <= maximal_pumps; i++) { // insert number of maximum pumps here
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
      console.log(array_rand);
      $('#ballon').width(size); 
      $('#ballon').height(size);
      $('#ballon').show()
      $('#round').html('<h2>'+label_header+round+'<h2>');
      $('#total_value').html(total+label_currency);
  };
  
  // what happens when the game ends
  var end_game = function() {
    $('#sliderwrap').remove();
    $('#total').remove();
    $('#collect').remove();
    $('#ballon').remove();
    $('#press').remove();
    $('#round').html(end_gratz);
    $('#goOn').show();
    $('#message').html(msg_end1+total+msg_end2).show();
    $('#saveThis1').html('<input type='+saveThis+' name ="v_177" value="'+number_pumps+'" />');
    $('#saveThis2').html('<input type='+saveThis+' name ="v_178" value="'+exploded+'" />');
  };
  
  
  // ... message shown if balloon explodes
  var explosion_message = function() {
    $('#message').html(msg_explosion).show().delay(2000).hide(0);
  };
  
  // ... message shown if balloon does not explode
  var collected_message = function() {
    $('#ballon').hide();
    $('#message').html(msg_collect).show().delay(2000).hide(0);
  };
   

  // pump button functionality -> 'pressure' in slider bar increases
  $('#press').click(function() {
    if (pumps >= 0 && pumps < maximal_pumps) { // interacts with the collect function, which sets pumps to -1, making the button temporarily unclickable
      pumps += 1;
      $("#slider" ).slider( "option", "value", pumps );
    }
  });
  
  // animate explosion
  var balloon_explode = function() {
    $('#ballon').hide( "explode", {pieces: 48}, 1000 );
  };
  
  // release pressure and hope for money
  $('#collect').click(function() {
      if (pumps > 0) { // only works after at least one pump has been made
	var explosion = 0; // is set to one if pumping goes beyond explosion point; see below
	number_pumps.push(pumps); // save number of pumps
	var pumpmeup = pumps
	pumps = -1; // makes pumping button unclickable until new round starts
	for (var i = 0; i < pumpmeup; i++) {
	  size += increase;
	  if (array_rand[i] === 1) { 
	    var explosion = 1; // when pumping goes beyond explosion point !
	    break; // break loop when explosion point is reached; balloon will not get pumped any further!
	  }
	}
	//determine animation speed; faster for smaller balloons
        if (i < 3) {
	  var animate_speed = 200;
        } else if (i < 6) {
	  var animate_speed = 300;
	} else if (i < 11) {
	  var animate_speed = 400;
	} else if (i < 16) {
	  var animate_speed = 500;
        } else if (i < 21) {
	  var animate_speed = 600;
	} else if (i < 26) {
	  var animate_speed = 700;
	} else { 
	  var animate_speed = 800; 
	}
	// animates slider value to 0
        $('#slider').slider('value', 0);
	// balloon gets pumped using jQuery animation
	$('#ballon').animate({
	  width: size+'px',
	  height: size+'px',
	  }, animate_speed
        );
	// handle explosion
	if (explosion === 1) {
	  setTimeout(balloon_explode, animate_speed);
	  setTimeout(explosion_message, animate_speed+1400);
	  if (round < rounds_played) {
	    setTimeout(new_round, animate_speed+3400);
	  }
	  else {
	    setTimeout(end_game, animate_speed+3500);
	  }
	}
	// handle no explosion
	else {
	  total += pumpmeup
	  setTimeout(collected_message, animate_speed+1000);
	  if (round < rounds_played) {
	    setTimeout(new_round, animate_speed+3000);
	  }
	  else {
	    setTimeout(end_game, animate_speed+3100);
	  }
	}
	console.log(number_pumps);	
	exploded.push(explosion); // save whether balloon has exploded or not
	console.log(exploded);
      }
  });
  
  
  // initialize slider that handles the pumps
  $( "#slider" ).slider( {
    orientation: "vertical",
    value: 0,
    min: 0,
    max: 32,
    disabled: true,
    animate: true,
    create: function( event, ui ) {
      var v=$(this).slider('value');
      $(this).find('.ui-slider-handle').text(v);
    },
    change: function( event, ui ) {
      $(this).find('.ui-slider-handle').text(ui.value);
    },
    range: "min",
  });
  
  
  // continue button is shown when the game ends
  $("#goOn").click(function() {
    $("form[name=f1]").submit();
  });
  
  // start the game!
  new_round();
  
});
