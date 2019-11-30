$(document).ready(function () {
	"use strict";


	//GLOBAL VARIABLES
	var wordCount = 0;
	var shuffledWordList = shuffleArray(wordList);

	let searchParams = new URLSearchParams(window.location.search);
	var testingTrue = searchParams.has('test');

	var timer = new Tock({
		callback:  function () {
			var current_time = timer.msToTime(timer.lap());
		}
	});

	// EVENT LISTENERS

	$("#train-all-btn").on("click", function () {
		setGame();
		nextWord();
	});


	$("#train-first-btn, #train-second-btn").on("click", function () {
		var sixWeeksVal = $(this).data("id");
		setGame();
		shuffledWordList = filterWords(sixWeeksVal);
		nextWord();
	});


	$(document).keyup(function(event) {
		var selectedKey = event.keyCode;
		if(selectedKey === 39 && wordCount > 0){
			nextWord();
		}
	});


	$("#next-btn").on("click", function (event) {
		event.preventDefault();
		nextWord();
	});

	//FUNCTIONS

	function setGame(){
		shuffledWordList = shuffleArray(wordList);
		wordCount = 0;
		$("#six-weeks-row").addClass('hide-this');
		$("#next-btn-row").addClass('show-this');
		$("#main-container").html("");
		$("#word-container").addClass('container-size')
	}


	function filterWords(sixWeeks){
		return shuffledWordList.filter(function (word) {
			return word.semester === sixWeeks;
		});
	}


	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array
	}


	function getColor(word){
		if(word.color){
			return ' style="color:' + word.color +'"'
		}
	}

	function getImage(word) {
		if(word.image != null){
			return '<img style="height: 200px; max-width: 100%;" src="'+ word.image +'" alt="">'
		} else {
			return "";
		}
	}

	function createEndHtml(endTime){
		var html = "";
		html += '<div>';
		html += '<h1>Great job! No more words!</h1>';
		html += '<h4>Total Time: ' + endTime + ' seconds</h4>';
		html += '</div>';

		return html
	}


	function getEndTime(){
		timer.stop();
		return timer.msToTime(timer.lap());
	}

	function endGame(){
		var endTime = getEndTime();
		var endHtml = createEndHtml(endTime);
		$("#six-weeks-row").removeClass('hide-this');
		$("#next-btn-row").removeClass('show-this').addClass('hide-this');
		$("#main-container").html(endHtml);
		$("#word-container").removeClass('container-size')

	}

	function createWordHtml(currentWord){
		var wordHtml = "";
		if(testingTrue){
			wordHtml += '<div class="main-word">'+ currentWord.word +'</div>';
		} else {
			wordHtml += '<div class="main-word" '+ getColor(currentWord) +'>'+ currentWord.word +'</div>';
			wordHtml += getImage(currentWord)
		}
		return wordHtml;
	}

	function nextWord(){
		if (wordCount === shuffledWordList.length) {
			endGame();
			return;
		}

		if(wordCount === 0){
			timer.start();
		}

		var currentWord = shuffledWordList[wordCount];
		var wordHtml = createWordHtml(currentWord);
		$("#main-container").html(wordHtml);

		wordCount +=1;
	}


	document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchmove', handleTouchMove, false);

	var xDown = null;
	var yDown = null;

	function getTouches(evt) {
		return evt.touches ||             // browser API
			evt.originalEvent.touches; // jQuery
	}

	function handleTouchStart(evt) {
		const firstTouch = getTouches(evt)[0];
		xDown = firstTouch.clientX;
		yDown = firstTouch.clientY;
	};

	function handleTouchMove(evt) {
		if ( ! xDown || ! yDown ) {
			return;
		}

		var xUp = evt.touches[0].clientX;
		var yUp = evt.touches[0].clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;

		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
			if ( xDiff > 0 ) {
				/* left swipe */
				console.log('left swipe');
				nextWord();
			} else {
				/* right swipe */
				console.log("right swipe");
			}
		} else {
			if ( yDiff > 0 ) {
				/* up swipe */
				console.log("up swipe");
			} else {
				/* down swipe */
				console.log("down swipe");
			}
		}
		/* reset values */
		xDown = null;
		yDown = null;
	};

});