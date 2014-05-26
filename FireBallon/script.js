// fire version of the BART

$(document).ready(function() { 

  // initialize values
  
  var round = 0;
  var start_size = 100; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
  var increase = 7; // number of pixels by which balloon is increased each pump
  var size; // start_size incremented by 'increase'
  var pumps; 
  var total = 0; // money that has been earned in total (in several rounds)
  var money = 0; // money that has been earned in a single round
  var win_lastround = 0;
  var array; // will be used to determine the explosion point of the balloon
  var array_rand; // numbers are drawn from this array; it is filled in the 'new_sequence' function
  
  // initialize language
  
  var label_press = 'Zum Aufpumpen klicken';
  var label_collect = 'Guthaben einsammeln:';
  var label_lastround = 'Letzte Runde:';
  var label_balance = 'Gesamtguthaben:';
  var label_currency = ' Euro';
  var label_header = 'Ballon Spiel Runde ';
  var msg_explosion = '<h2>Der Ballon ist explodiert und das erspielte Geld verloren!<br />Die nächste Runde startet.</h2>';
  var msg_collect = '<h2>Das erspielte Geld ist sicher in der Bank.<br />Die nächste Runde startet.</h2>';
  
  // initialize labels
  
  $('#press').html(label_press); 
  $('#collect_term').html(label_collect);
  $('#lastround_term').html(label_lastround);
  $('#total_term').html(label_balance);

  // function to create an array determining the break point of the ballon; balloon explodes when number 1 is drawn from the array
  var new_sequence = function() {

    // create array containing the numbers 1:32; ballon should only explode after 16 pumps
    array = [];
    for (var i = 17; i <= 32; i++) { // insert number of maximum pumps here
      array.push(i);
    }

    // randomize array sequence
    array_new = array;
    
    array = [];
    for (var i = 1; i <= 16; i++) { // insert number of maximum pumps here
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
    
    console.log(array_new);
    console.log(array_rand);
    array_rand = array_new.concat(array_rand);
    console.log(array_rand);
  };


  // what happens when a new round starts
  var new_round = function() {
    round += 1;
    size = start_size;
    pumps = 0;
    money = 0;
    new_sequence();
    $('#ballon').width(size); 
    $('#ballon').height(size);
    $('#ballon').show()
    $('#round').html('<h2>'+label_header+round+'<h2>');
    $('#collect_value').html(money.toFixed(2)+label_currency);
    $('#lastround_value').html(win_lastround.toFixed(2)+label_currency);
    $('#total_value').html(total.toFixed(2)+label_currency);
    $('#fire').css('display', 'block');
  };
  
  
  // text that is shown when a round ends...
  // ...if the balloon explodes
  var explosion = function() {
    $('#message').html(msg_explosion).show().delay(2000).hide(0);
    $("#fire").hide(0).delay(2000).show(0);
  }
  
  // ... if the money is collected before it explodes
  var collected = function() {
    $('#message').html(msg_collect).show().delay(2000).hide(0);
    $("#fire").hide(0).delay(2000).show(0);
  }
   

  // pump button functionality 
  $('#press').click(function() {
    if (pumps >= 0) { // interacts with the collect function, which sets pumps to -1, making the button temporarily unclickable
      if (pumps < array_rand.indexOf(1)+1) { // pumping is only clickable until the balloon explodes
	
	// what happens 
	// ...if the balloon explodes
	if (array_rand[pumps] === 1) {
	  money = 0;
	  win_lastround = money;
	  pumps += 1;
	  $('#ballon').fadeOut('slow');
	  setTimeout(explosion, 1100);
	  setTimeout(new_round, 3500);
	}
	
	// ...if the balloon is pumped
	else { 
	  size += increase;
	  pumps += 1; 
	  money += 0.05;
	  $('#ballon').width(size); 
	  $('#ballon').height(size);
	  $('#collect_value').html(money.toFixed(2)+label_currency); 
	}
      }
    }
  });

  // money collect button functionality
  $('#collect').click(function() {
    if (pumps < array_rand.indexOf(1)+1) {
      if (pumps > 0) { // only works after at least one pump has been made
        pumps = -1; // makes pumping button unclickable until new round starts
        total += money;
	win_lastround = money;
        money = 0;
        $('#ballon').hide();
        collected();
        setTimeout(new_round, 2000);
      }
    }
  });

  // start the game!
  new_round();
  
});

