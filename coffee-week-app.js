var randomizerController = (function() {
	const randomizeData = function(data) {
	    let currentIndex = data.users.length, 
	    	temporaryValue, 
	    	randomIndex, 
	    	newList, 
	    	i, 
	    	pairs = [], 
	    	d = new Date(),
	    	weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
		
		data.users.forEach( element => {
			// randomize weekday array values and assign to individual users
			element.deliveryDate = weekday[Math.round(Math.random() * (weekday.length - 1))];
		});

		//Shuffle elements
	    while (0 !== currentIndex) {
		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    // And swap it with the current element.
		    temporaryValue = data.users[currentIndex];
		    data.users[currentIndex] = data.users[randomIndex];
		    data.users[randomIndex] = temporaryValue;
	    }

	    newList = data.users;
		pairs.push([newList[newList.length- 1], newList[0]]);

		for (i = 1; i < newList.length; i++) {
			pairs.push([newList[i - 1], newList[i]]);
		}

	  	return pairs;
	}

	return {
		publicRandomizer: function(data) {
			return randomizeData(data);
		}
	}
})();

var UIController = (function() {
	return {
		addListItem: function(obj) {
			let html = '';

			// create html and popluate with user data
			obj.forEach( element => {
				html += '<div class="cw-data-grid-item cw-data-container"><div class="cw-data-inner">'
				html += '<div><b>' + element[0].name.first + ' ' + element[0].name.last + '</b> is scheduled to deliver a coffee to';
				html += '&nbsp;<b>' + element[1].name.first + ' ' + element[1].name.last + '</b>';
				html += '&nbsp;on&nbsp;' + element[1].deliveryDate + '</div>';	
				html += '</div></div>'
			});

			//clear and then insert html into the dom
			document.querySelector('#cw-mainContent').innerHTML = '';
			document.querySelector('#cw-mainContent').insertAdjacentHTML('beforeend', html);
		}
	}
})();

var dataController = (function(UICtrl, randomizerCtrl) {
	return {
		getJsonResponse: function(location) {
			// make call to get user data
			fetch ('https://hbc-frontend-challenge.hbccommon.private.hbc.com/coffee-week/users?location=' + location + '&department=engineering')
			.then(result => {
				return result.json();
			})
			.then(data => {
				if (data.users.length > 1) {
					// modify user data and send to UI Controller
					UICtrl.addListItem(randomizerCtrl.publicRandomizer(data));
				}
			})

			.catch(error => console.log(error));
		}
	}
})(UIController, randomizerController);

//Global app controller
var globalAppController = (function(dataCtrl) {
	const creatEventListeners = function(e) {
		document.addEventListener('click', function (e) {
		    if ( e.target.classList.contains( 'cw-randomize-btn' ) ) {
		        dataCtrl.getJsonResponse(e.target.id);
		    }
		}, false);
	};

	return {
		init: function() {
			creatEventListeners();
		}
	}
})(dataController);

globalAppController.init();
