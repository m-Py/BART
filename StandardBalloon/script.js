// standard version of the BART

$(document).ready(function() { 

    var saveThis = 'hidden'; // text fields that saves data should not be shown; can be shown in testing
  
    // initialize values
    var round = 0;
    var start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
    var increase = 2; // number of pixels by which balloon is increased each pump
    var size; // start_size incremented by 'increase'
    var pumps; 
    var total = 0; // money that has been earned in total
    var rounds_played = 30;
    var explode_array =  [31, 80,  63, 103, 20,  26, 100,  75, 109,  72,  88,  77, 113, 22,  83,  86,  57,  14, 9,  90,  56,  41,  56,  27, 108,  42, 116,  18,  43,  95];
    var maximal_pumps = 128;
    var pumpmeup; // number pumps in a given round; is updated each round
    var number_pumps = []; // arrays for saving number of pumps
    var exploded = []; // array for saving whether ballon has exploded
    var explosion; // will an explosion occur? 1 = yes, 0 = no
    var last_win = 0; // initialize variable that contains the win of the previous round
    
    // initialize language
    var label_press = 'Ballon aufpumpen';
    var label_collect = '$$$ einsammeln';
    var label_balance = 'Gesamtguthaben:';
    var label_last = 'Gewinn letzte Runde:';
    var label_currency = ' Taler';
    var label_header = 'Ballon-Spiel Runde ';
    var label_gonext1 = 'Nächste Runde starten';
    var label_gonext2 = 'Spiel beenden';
    var msg_explosion1 = '<p>Der Ballon ist in dieser Runde nach dem ';
    var msg_explosion2 = '. Mal Aufpumpen geplatzt. <p>Sie haben in dieser Runde kein Geld verdient.</p>';
    
    var msg_collect1 = '<p>Der Ballon ist nicht geplatzt!</p><p>Sie verdienen diese Runde ';
    var msg_collect2 = ' Taler.</p><p> Das erspielte Geld ist sicher in der Bank.</p>';
    
    var msg_end1 = '<p>Damit ist dieser Teil der Studie abgeschlossen. Sie haben im Ballon-Spiel ';
    var msg_end2 = ' Taler Gewinn gemacht. </p><p>Klicken Sie auf <i>Weiter</i>, um mit der Studie fortzufahren.</p>';
    
    var err_msg = 'Sie können erst Geld einsammeln, sobald Sie den Ballon mindestens einmal aufgepumpt haben. Betätigen Sie dazu den Button "Ballon aufpumpen."';
  
  
    // initialize labels
    $('#press').html(label_press); 
    $('#collect').html(label_collect);
    $('#total_term').html(label_balance);
    $('#total_value').html(total+label_currency);
    $('#last_term').html(label_last);
    $('#last_value').html(last_win+label_currency);
    
    // below: create functions that define game functionality
    
    // what happens when a new round starts
    var new_round = function() {
        console.log(number_pumps);
        console.log(exploded);
        $('#gonext').hide();
        $('#message').hide();  
        $('#collect').show();
        $('#press').show();
        round += 1;
        size = start_size;
        pumps = 0;
        $('#ballon').width(size); 
        $('#ballon').height(size);
        $('#ballon').show();
        $('#round').html('<h2>'+label_header+round+'<h2>');
    };
  
    // what happens when the game ends
    var end_game = function() {
        $('#total').remove();
        $('#collect').remove();
        $('#ballon').remove();
        $('#press').remove();
        $('#gonext').remove();
        $('#round').remove();
        $('#last_round').remove();
        $('#goOn').show();
        $('#message').html(msg_end1+total+msg_end2).show();
        store_data(); // note: this function needs to be defined properly
    };
    
    // Important: this function will have to be replaced to ensure that
    // the data is actually sent to _your_ server: 
    var store_data = function() {
        $('#saveThis1').html('<input type='+saveThis+' name ="v_177" value="'+number_pumps+'" />');
        $('#saveThis2').html('<input type='+saveThis+' name ="v_178" value="'+exploded+'" />');
        $('#saveThis3').html('<input type='+saveThis+' name ="v_577" value="'+total+'" />');
    };
    
    // message shown if balloon explodes
    var explosion_message = function() {
        $('#collect').hide();
        $('#press').hide();
        $('#message').html(msg_explosion1+pumpmeup+msg_explosion2).show();
    };
    
    // message shown if balloon does not explode
    var collected_message = function() {
        $('#collect').hide();
        $('#press').hide();    
        $('#message').html(msg_collect1+pumpmeup+msg_collect2).show();
    };  
    
    // animate explosion using jQuery UI explosion
    var balloon_explode = function() {
        $('#ballon').hide( "explode", {pieces: 48}, 1000 );

        // activate this if you have a sound file to play a sound
        // when the balloon explodes:
        
        // document.getElementById('explosion_sound').play();
    };  
    
    // show button that starts next round
    var gonext_message = function() {
        $('#ballon').hide();
        if (round < rounds_played) {
            $('#gonext').html(label_gonext1).show();
        } else {
            $('#gonext').html(label_gonext2).show();
        }
    };
    
    // add money to bank
    var increase_value = function() {
        $('#total_value').html(total+label_currency);
    };
    
    var show_last = function() {
        $('#last_value').html(last_win+label_currency);
    };
    
    // button functionalities
    
    // pump button functionality
    $('#press').click(function() {
        if (pumps >= 0 && pumps < maximal_pumps) { // interacts with the collect function, which sets pumps to -1, making the button temporarily unclickable
            explosion = 0; // is set to one if pumping goes beyond explosion point; see below
            pumps += 1;
            if (pumps < explode_array[round-1]) {
	        size +=increase;
	        $('#ballon').width(size); 
                $('#ballon').height(size);
            } else {
	        last_win = 0;
	        pumpmeup = pumps;
	        pumps = -1; // makes pumping button unclickable until new round starts
	        explosion = 1; // save that balloon has exploded this round
	        balloon_explode();
	        exploded.push(explosion); // save whether balloon has exploded or not
	        number_pumps.push(pumpmeup); // save number of pumps
	        setTimeout(explosion_message, 1200);
	        setTimeout(gonext_message, 1200);
	        setTimeout(show_last, 1200);
            }
        }
    });
  
  
    // collect button: release pressure and hope for money
    $('#collect').click(function() {
        if (pumps === 0) {
	    alert(err_msg);
        } else if (pumps > 0) { // only works after at least one pump has been made
	    exploded.push(explosion); // save whether balloon has exploded or not
            // activate this if you have a sound file to play a sound
            // when the balloon does not explode:
            
	    // document.getElementById('tada_sound').play(); 
	    number_pumps.push(pumps); // save number of pumps
	    pumpmeup = pumps;
	    pumps = -1; // makes pumping button unclickable until new round starts
	    $('#ballon').hide();
	    collected_message();
	    gonext_message();
	    total += pumpmeup;
	    last_win = pumpmeup;
	    increase_value();
	    show_last();
        }
    });
    
    // click this button to start the next round (or end game when all rounds are played)
    $('#gonext').click(function() {
        if (round < rounds_played) {
            new_round();
        } else {
            end_game();
        }
    });
    
    // continue button is shown when the game has ended. This needs to be replaced
    // by a function that takes into account on which platform the BART runs (i.e.
    // how will the page be submitted?)
    $("#goOn").click(function() {
        $("form[name=f1]").submit();
    });
    
    // start the game!
    new_round();
    
});
