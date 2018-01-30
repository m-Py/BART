# BART

Implementation of the Balloon Analogue Risk Task (BART) in JavaScript.

Includes two BART versions:
- The directory StandardBalloon contains the original version, as
  described in Lejuez et al. (2002)
- The directory PressureBalloon contains a modified short version of the
  BART, which is inspired by the automated BART, as seen in Pleskac et
  al. (2008)

## Running the BART

In order to run the BART, just open the respective `index.html` file for
one of the BART versions. In addition to the `script.js` and the
`style.css` file, the jQuery and jQuery UI libraries must be embedded
into the .html files for the BART to work.

- http://jquery.com/
- http://jqueryui.com/

Note that the jQuery UI libraries is not necessary to run the BART, but
it will produce a nice little animation when the balloon explodes, so
you might want to use it.

You might want to consider replacing the image of the balloon
`Balloon.png` image by a nicer one, but feel free to use this one if you
do not have access to a better image.

### Data storage

If you consider using this BART version in your online study, you will
have to implement some data storage function that transfers the
collected data -- i.e. the number of pumps per round and whether an
explosion has occurred -- to your server. This means that you will have
to replace the function `store_data` in the `script.js` file. It should
transfer the arrays `number_pumps` and `exploded` encoding the number of
pumps and whether an explosion has occurred, respectively, for each
round.

Also, you will probably have to ensure that the page containing the BART
will be submitted after it has been played. Currently there is an event
bound to a button `#goOn` submitting the page, but you will have to
insert code so that this event actually triggers the page to submit in
the environment that *you* are using.

## License

This repository is in the public domain. Feel free to do with it
whatever you like. I like hearing from people, so if you have any
questions or comments feel to write an e-mail to me.

## References

Lejuez, C. W., Read, J. P., Kahler, C. W., Richards, J. B., Ramsey,
S. E., Stuart, G. L., Strong, D. R. & Brown, R. A. (2002). Evaluation of
a behavioral measure of risk taking: the Balloon Analogue Risk Task
(BART). *Journal of Experimental Psychology: Applied, 8*(2), 75-84.

Pleskac, T. J., Wallsten, T. S., Wang, P., & Lejuez,
C. W. (2008). Development of an Automatic Response Mode to Improve the
Clinical Utility of Sequential Risk-Taking Tasks. *Experimental and
Clinical Psychopharmacology, 16*(6), 555-564.
