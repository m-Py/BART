// pressure version of the BART

$(document).ready(function() { 

  var saveThis = 'hidden'; // text fields that save data should not be shown; can be shown in testing
  
  // initialize values
  var round = 0;
  var start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
  var increase = 8; // number of pixels by which balloon is increased each pump
  var size; // start_size incremented by 'increase'
  var pumps; 
  var total = 0; // money that has been earned in total
  var rounds_played = 6;
  var explode_array =  [17, 10, 23, 13, 7, 20];
  var maximal_pumps = 30;
  var pumpmeup; // number pumps in a given round
  var number_pumps = []; // arrays for saving number of pumps
  var exploded = []; // array for saving whether ballon has exploded
  
  
  // initialize language
  var label_press = 'Druck in der Zuleitung erhöhen';
  var label_collect = 'Ballon mit Luft aus Zuleitung aufpumpen';
  var label_balance = 'Gesamtguthaben:';
  var label_currency = ' Taler';
  var label_header = 'Ballon-Spiel Runde ';
  var label_gonext1 = 'Nächste Runde starten';
  var label_gonext2 = 'Spiel beenden';
  var msg_1 = '<p>Sie haben in dieser Runde ';
  var msg_explosion2 = ' Mal den Druck erhöht. Der Ballon ist jedoch schon nach ';
  var msg_explosion3 = ' Druckerhöhungen geplatzt!</p><p>Sie haben in dieser Runde kein Geld verdient.</p>';
  var msg_collect2 = ' Mal den Druck erhöht, ohne dass der Ballon explodiert ist. Der Ballon wäre in dieser Runde erst nach '
  var msg_collect3 = ' Druckerhöhungen geplatzt.</p><p>Sie haben ';
  var msg_collect4 = ' Taler Gewinn gemacht. Das erspielte Geld ist sicher in der Bank.</p>';
  var msg_end1 = '<p>Damit ist der erste von vier Teilen der Studie abgeschlossen. Sie haben im Ballon-Spiel ';
  var msg_end2 = ' Taler Gewinn gemacht. </p><p>Klicken Sie auf <i>Weiter</i>, um mit dem <strong>Persönlichkeitstest</strong>, dem <strong>Wortschatztest</strong> und dem <strong>Quiz</strong> fortzufahren.</p>';
  
  
  // initialize labels
  $('#press').html(label_press); 
  $('#collect').html(label_collect);
  $('#total_term').html(label_balance);
  $('#total_value').html(total+label_currency);
  
  
  // below: create functions that define game functionality
  
  // what happens when a new round starts
  var new_round = function() {
    $('#gonext').hide();
    $('#message').hide();  
    $('#collect').show();
    $('#press').show();
    round += 1;
    size = start_size;
    pumps = 0;
//  console.log(explode_array[round-1]);
    $('#ballon').width(size); 
    $('#ballon').height(size);
    $('#ballon').show();
    $('#round').html('<h2>'+label_header+round+'<h2>');
  };
  
  // what happens when the game ends
  var end_game = function() {
    $('#sliderwrap').remove();
    $('#total').remove();
    $('#collect').remove();
    $('#ballon').remove();
    $('#press').remove();
    $('#gonext').remove();
    $('#round').remove();
    $('#goOn').show();
    $('#message').html(msg_end1+total+msg_end2).show();
    $('#saveThis1').html('<input type='+saveThis+' name ="v_177" value="'+number_pumps+'" />');
    $('#saveThis2').html('<input type='+saveThis+' name ="v_178" value="'+exploded+'" />');
  };
  
  // message shown if balloon explodes
  var explosion_message = function() {
    $('#collect').hide();
    $('#press').hide();
    $('#message').html(msg_1+pumpmeup+msg_explosion2+explode_array[round-1]+msg_explosion3).show();
  };
  
  // message shown if balloon does not explode
  var collected_message = function() {
    $('#collect').hide();
    $('#press').hide();    
    $('#message').html(msg_1+pumpmeup+msg_collect2+explode_array[round-1]+msg_collect3+pumpmeup+msg_collect4).show();
  };  

  // animate explosion using jQuery UI explosion
  var balloon_explode = function() {
    $('#ballon').hide( "explode", {pieces: 48}, 1000 );
  };  
  
  // show button that starts next round
  var gonext_message = function() {
    $('#ballon').hide();
    if (round < rounds_played) {
      $('#gonext').html(label_gonext1).show();
    }
    else {
      $('#gonext').html(label_gonext2).show();
    }
  };

  // add money to bank
  var increase_value = function() {
    $('#total_value').html(total+label_currency);
  };
  
  
  // button functionalities
  
  // pump button functionality -> 'pressure' in slider bar increases
  $('#press').click(function() {
    if (pumps >= 0 && pumps < maximal_pumps) { // interacts with the collect function, which sets pumps to -1, making the button temporarily unclickable
      pumps += 1;
      $("#slider" ).slider( "option", "value", pumps );
    }
  });
  
  // click this button to start the next round (or end game when all rounds are played)
  $('#gonext').click(function() {
    if (round < rounds_played) {
      new_round();
    }
    else {
      end_game();
    }
  });  

  // continue button that is shown when the game has ended
  $("#goOn").click(function() {
    $("form[name=f1]").submit();
  });
  
  // collect button: release pressure and hope for money
  $('#collect').click(function() {
      if (pumps === 0) {
	alert('In der Zuleitung befindet sich noch keine Luft. Sie können den Ballon erst aufpumpen, sobald Sie mindestens einmal Luft in die Zuleitung gepumpt haben. Betätigen Sie dazu den Button "Druck in der Zuleitung erhöhen."');
      }
      else if (pumps > 0) { // only works after at least one pump has been made
	var explosion = 0; // is set to one if pumping goes beyond explosion point; see below
	number_pumps.push(pumps); // save number of pumps
	pumpmeup = pumps;
	pumps = -1; // makes pumping button unclickable until new round starts
	for (var i = 0; i < pumpmeup; i++) {
	  size += increase;
	  if (i === explode_array[round-1]-1) { // -> insert explosion criterion here
	    explosion = 1; 
	    break; // break loop when explosion point is reached; balloon will not get pumped any further!
	  }
	}
	//determine animation speed; faster for smaller balloons
        if (i < 4) {
	  var animate_speed = 200;
        } else if (i < 7) {
	  var animate_speed = 300;
	} else if (i < 12) {
	  var animate_speed = 400;
	} else if (i < 17) {
	  var animate_speed = 500;
        } else if (i < 22) {
	  var animate_speed = 600;
	} else if (i < 27) {
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
	  setTimeout(gonext_message, animate_speed+1400);
	}
	// handle no explosion
	else {
	  total += pumpmeup;
	  setTimeout(collected_message, animate_speed+1000);
	  setTimeout(increase_value, animate_speed+1000);
	  setTimeout(gonext_message, animate_speed+1000);
	}
	// console.log(number_pumps);	
	exploded.push(explosion); // save whether balloon has exploded or not
	// console.log(exploded);
	// console.log(i);
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
  
  
  // start the game!
  new_round();
  
});
