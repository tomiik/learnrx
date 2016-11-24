var ex28 = function(button) {
	console.log("ex28()")
	// the button click handler
	var handler = function(ev) {
		// Unsubscribe from the button event.
		button.removeEventListener("click", handler);

		alert("Button was clicked. Unsubscribing from event.");
	};

	// add the button click handler
	button.addEventListener("click", handler);
}

var ex29 = function(button) {
	var buttonClicks = Rx.Observable.fromEvent(button, "click");

	// In the case of an Observable, forEach returns a subscription object.
	var subscription =
		buttonClicks.
			forEach(function(clickEvent) {
				alert("Button was clicked. Stopping Traversal.");

				// Stop traversing the button clicks
				subscription.dispose();
			});
}

var ex30 = function(button) {
	var buttonClicks = Rx.Observable.fromEvent(button, "click");

	// Use take() to listen for only one button click
	// and unsubscribe.
	buttonClicks.take(1).
		// Insert take() call here
		forEach(function(clickEvent) {
			alert("Button was clicked once. Stopping Traversal.");
		});
}

var ex31 = function(pricesNASDAQ, printRecord, stopButton) {
	var stopButtonClicks = Rx.Observable.fromEvent(stopButton,"click"),
		microsoftPrices =
			pricesNASDAQ.
				filter(function(priceRecord) {
					return priceRecord.name === "MSFT";
				}).
				takeUntil(stopButtonClicks);

	microsoftPrices.
		forEach(function(priceRecord) {
			printRecord(priceRecord);
		});
}

var ex32 = function(sprite, spriteContainer) {
	var spriteMouseDowns = Rx.Observable.fromEvent(sprite, "mousedown"),
		spriteContainerMouseMoves = Rx.Observable.fromEvent(spriteContainer, "mousemove"),
		spriteContaineMouseUps = Rx.Observable.fromEvent(spriteContainer, "mouseup"),
		spriteMouseUps = Rx.Observable.fromEvent(sprite, "mouseup"),
		MouseUps = Rx.Observable.merge(spriteContaineMouseUps, spriteMouseUps)
		spriteMouseDrags =
			// For every mouse down event on the sprite...
			spriteMouseDowns.
      concatMap(function(a){
				return spriteContainerMouseMoves.
					takeUntil(MouseUps)});

	// For each mouse drag event, move the sprite to the absolute page position.
	spriteMouseDrags.forEach(function(dragPoint) {
		sprite.style.left = dragPoint.pageX + "px";
		sprite.style.top = dragPoint.pageY + "px";
		console.log(sprite.style.left + ", " + sprite.style.top);
	});
}

var ex33 = function(sprite, spriteContainer) {
	// All of the mouse event sequences look like this:
	// seq([ {pageX: 22, pageY: 3423, layerX: 14, layerY: 22} ,,, ])
	var spriteMouseDowns = Rx.Observable.fromEvent(sprite, "mousedown"),
		spriteContainerMouseMoves = Rx.Observable.fromEvent(spriteContainer, "mousemove"),
		spriteContainerMouseUps = Rx.Observable.fromEvent(spriteContainer, "mouseup"),
		spriteMouseUps = Rx.Observable.fromEvent(sprite, "mouseup"),
		MouseUps = Rx.Observable.merge(spriteContainerMouseUps,spriteMouseUps),
		// Create a sequence that looks like this:
		// seq([ {pageX: 22, pageY:4080 },,,{pageX: 24, pageY: 4082},,, ])
		spriteMouseDrags =
			// For every mouse down event on the sprite...
			spriteMouseDowns.
				concatMap(function(contactPoint) {
					// ...retrieve all the mouse move events on the sprite container...
					return spriteContainerMouseMoves.
						// ...until a mouse up event occurs.
						takeUntil(MouseUps).
            map(function(a){
							console.log(a.pageX + "," + a.pageY + "," + contactPoint.layerX + "," + contactPoint.layerY)
							console.log((a.pageX - contactPoint.layerX) + "," + (a.pageX - contactPoint.layerY))
              return{
                pageX: a.pageX - contactPoint.layerX,
                pageY: a.pageY - contactPoint.layerY
              }
            })

				});

	// For each mouse drag event, move the sprite to the absolute page position.
	spriteMouseDrags.forEach(function(dragPoint) {
		sprite.style.left = dragPoint.pageX + "px";
		sprite.style.top = dragPoint.pageY + "px";
	});
}

var ex34 = function() {
	console.log("ex34()");
	$.getJSON(
		"http://api.openweathermap.org/data/2.5/weather?q=Hyderabad&APPID=0a72030de86532dc606cd9e539fc94bd",
		{
			success: function(json) {
				console.log("Data has arrived.");
			},
			error: function(ex) {
				console.log("There was an error.", ex)
			}
		});
}

var ex38 = function (clicks, saveData, name) {
	return clicks.
		// TODO: Throttle the clicks so that it only happens every one second
    throttle(5000);
		concatMap(function () {
			return saveData(name);
		});
}


ex28(document.getElementById("ex28_run"));
ex29(document.getElementById("ex29_run"));
ex30(document.getElementById("ex30_run"));
var sprite = document.getElementById("ex32_sprite")
var container = document.getElementById("ex32_sprite_container")
sprite.style.left = (container.getBoundingClientRect().left + window.pageXOffset) +"px";
sprite.style.top = (container.getBoundingClientRect().top + window.pageYOffset) + "px";

sprite = document.getElementById("ex33_sprite")
container = document.getElementById("ex33_sprite_container")
sprite.style.left = (container.getBoundingClientRect().left + window.pageXOffset) +"px";
sprite.style.top = (container.getBoundingClientRect().top + window.pageYOffset) + "px";

ex32(document.getElementById("ex32_sprite"),document.getElementById("ex32_sprite_container"));
ex33(document.getElementById("ex33_sprite"),document.getElementById("ex33_sprite_container"));

function dummy(){
	console.log("dummy");
}

var element = document.getElementById("ex34_run")
element.addEventListener("click", ex34, true);

element = document.getElementById("ex38_run")
element.addEventListener("click", ex34, true);
