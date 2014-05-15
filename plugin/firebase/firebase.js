/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealFirebase = (function() {
  function init() {
    var currentRef = new Firebase('https://slidee.firebaseio.com/current/');
    var controlRef = new Firebase('https://slidee.firebaseio.com/control/');

    controlRef.set(null);
    currentRef.set(getMessageData());
    controlRef.on('child_added', function(snapshot) {
      var msgData = snapshot.val();
      if(msgData === 'next') {
        Reveal.next();
      } else if(msgData === 'prev') {
        Reveal.prev();
      }
    });

    // Fires when slide is changed
    Reveal.addEventListener('slidechanged', update);

    // Fires when a fragment is shown
    Reveal.addEventListener('fragmentshown', update);

    // Fires when a fragment is hidden
    Reveal.addEventListener('fragmenthidden', update);

    /**
     * Posts the current slide data to the notes window
     */
    function update() {
      currentRef.set(getMessageData());
    }
  }

  function getMessageData() {
    var slideElement = Reveal.getCurrentSlide(),
      slideIndices = Reveal.getIndices(),
      messageData;

    var notes = slideElement.querySelector('aside.notes'),
      nextindexh,
      nextindexv;

    if(slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
      nextindexh = slideIndices.h;
      nextindexv = slideIndices.v + 1;
    } else {
      nextindexh = slideIndices.h + 1;
      nextindexv = 0;
    }

    var messageData = {
      'notes': notes ? notes.innerHTML : '',
      'indexh': slideIndices.h || null,
      'indexv': slideIndices.v || null,
      'indexf': slideIndices.f || null,
      'nextindexh': nextindexh || null,
      'nextindexv': nextindexv || null,
      'markdown': notes ? typeof notes.getAttribute('data-markdown') === 'string' : false
    };

    console.log(messageData);

    return messageData;
  }

  Reveal.addEventListener( 'ready', function( event ) {
    init();
  } );

})();

