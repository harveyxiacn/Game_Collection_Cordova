// log-controller.js

angular.module('log.controllers', ['log.services', 'ngCordova', 'ionic.rating', 'ngMaterial'])

.controller('AppCtrl', function($ionicPopup, $ionicPlatform, DB){
	console.log("AppCtrl");
	
})
// controller for home page
.controller('HomeCtrl', function($state, $scope, Game, $ionicSlideBoxDelegate, DB){
	// $state.reload();
	// function for changing slides in slidebox
	$scope.slideHasChanged = function(index){
    	$ionicSlideBoxDelegate.slide(index, 500);
    };
    // declare $scope.games as an array
    // $scope.games = [];

    console.log("load games in HomeCtrl");
	Game.all().then(function(games){
		console.log("game all");
		// $scope.games = games;
		getGameSlides(games);

    });
	    // console.log($scope.games[0].title);
	// $ionicSlideBoxDelegate.update(); update slide box if use ng-repeat
	var getGameSlides = function(games){
		console.log("getGameSlides");
    	var length = games.length;
    	console.log("length "+games.length);
	    $scope.gameSlides = [];
	    if(length>0){
	    	console.log("getGameSlides>0");
	        var rand = Math.floor(Math.random()*games.length);
	        console.log("random number:"+rand);
	        var randP1 = rand+1;
	        var randP2 = rand+2;
	        var randP3 = rand+3;
	        var randP4 = rand+4;
	        $scope.gameSlides.push(games[rand]);
	        console.log("randomGame1:"+$scope.gameSlides[0].title);
	        $ionicSlideBoxDelegate.update();

	        if(length>1){
	        	console.log("getGameSlides>1");
	        	if(randP1>=length){
	        		randP1=0;
	        		randP2=randP1+1;
	        		randP3=randP2+1;
	        		randP4=randP3+1;
	        	}
	    	    $scope.gameSlides.push(games[randP1]);
	    	    console.log("randomGame2:"+$scope.gameSlides[1].title);
	    	    $ionicSlideBoxDelegate.update();

	    	    if(length>2){
	    	    	console.log("getGameSlides>2");
	    	    	if(randP2>=length){
	    	    		randP2=0;
	    	    		randP3=randP2+1;
	        			randP4=randP3+1;
	    	    	}
		    	    $scope.gameSlides.push(games[randP2]);
		    	    console.log("randomGame3:"+$scope.gameSlides[2].title);
		    	    $ionicSlideBoxDelegate.update();

		    	    if(length>3){
		    	    	console.log("getGameSlides>3");
		    	    	if(randP3>=length){
		    	    		randP3=0;
		    	    		randP4=randP3+1;
		    	    	}
	    	    	    $scope.gameSlides.push(games[randP3]);
	    	    	    console.log("randomGame4:"+$scope.gameSlides[3].title);
	    	    	    $ionicSlideBoxDelegate.update();

	    	    	    if(length>4){
	    	    	    	console.log("getGameSlides>4");
	    	    	    	if(randP4>=length){
	    	    	    		randP4=0;
	    	    	    	}
		    	    	    $scope.gameSlides.push(games[randP4]);
		    	        	console.log("randomGame5:"+$scope.gameSlides[4].title);
		    	        	$ionicSlideBoxDelegate.update();
		    	        }
	    	    	}
		    	}
	    	}
	    }
    };
	// loadGame();
	// console.log($scope.games);
    
    // getGameSlides();

})

// controller for game list view
.controller('GameListCtrl', function($ionicHistory, $scope, Game, $stateParams, $ionicModal, $ionicPopup, $cordovaToast, $state){
	// $state.reload();
	$scope.data = {};

	//---------------------------------------------------------------
	//-------------------Read list from database---------------------
	$scope.games = [];
	$scope.game = null;
	var loadGame=function(){
		Game.all().then(function(games){
	        	$scope.games = games;
	    });
	};
	loadGame();
	// console.log("games length"+$scope.games.length);
    $scope.doRefresh=function(){
		loadGame();
		$scope.$broadcast('scroll.refreshComplete');
	};
	//---------------------------------------------------------------
	//----------------------Delete a game----------------------------
	//	delete a game by id
	$scope.onGameDelete = function(gameId){
		Game.deleteById(gameId).then(function(result){
	        $scope.result = result;
	        if($scope.result){
	        	$cordovaToast.showShortCenter('Successfully delete from games!').then(function(success) {
	        	}, function (error) {
	        		console.log("The toast was not shown due to " + error);
	        	});
	        }else{
	        	$cordovaToast.showShortCenter('Failed delete from games!').then(function(success) {
	        	}, function (error) {
	        		console.log("The toast was not shown due to " + error);
	        	});
	        }
	    });
		//	copy list
		var oldList = $scope.games;
		//	clear list
		$scope.games = [];
		//	cycle through list
		angular.forEach(oldList, function(x) {
			//add any game to games which is not the id
			if (x.id!=gameId) $scope.games.push(x);
		});
	};
	//---------------------------------------------------------------
	//-----------------------Edit a game-----------------------------
	//	new modal for editing a game by id
	$ionicModal.fromTemplateUrl('app/game/game-edit.html', function(modal){
		$scope.gameEditModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});

	//	popup a modal for editing a new game
	$scope.editGame = function(gameId){
		$state.go('app.game-edit', {gameId:gameId}, {reload: true});
		/*$scope.gameEditModal.show();
		Game.getById(gameId).then(function(game){
			$scope.game = game;

		});*/

	};
	//	close the modal
	$scope.closeEditGame = function(){
		$scope.gameEditModal.hide();
	};
	//	update database
	$scope.onGameEdit = function(game){
		//	check to see if game.title has been entered, if not exit
		if(!game){
			$cordovaToast.showShortCenter('Title is empty!').then(function(success) {
			}, function (error) {
				console.log("The toast was not shown due to " + error);
			});
			return;
		}
		console.log("onGameEdit game.description"+game.description);
		Game.updateGame(game).then(function(result){
	        $scope.result = result;
	        if($scope.result){
	        	$cordovaToast.showShortCenter('Successfully update to games!').then(function(success) {
	        	}, function (error) {
	        		console.log("The toast was not shown due to " + error);
	        	});
	        }else{
	        	$cordovaToast.showShortCenter('Failed update to games!').then(function(success) {
	        	}, function (error) {
	        		console.log("The toast was not shown due to " + error);
	        	});
	        }
	    });
		loadGame();
	    var backView = $ionicHistory.backView();
		backView && backView.go();
		// $scope.closeEditGame();
	};
	//---------------------------------------------------------------
	//	clear search box
	$scope.clearSearch = function() {
		$scope.data.searchQuery = '';
	};
		// get a specific game from database
	if(!angular.isUndefined($stateParams.gameId)){
		Game.getById($stateParams.gameId).then(function(game){
			$scope.game = game;
		});
	}



	//	new modal for editing a game by id
	$ionicModal.fromTemplateUrl('app/game/game-detail.html', function(modal){
		$scope.gameDetailModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	//	popup a modal for editing a new game
	$scope.detailGame = function(gameId){
		$scope.gameDetailModal.show();
		Game.getById(gameId).then(function(game){
			$scope.game = game;
		});

	};
	//	close the modal
	$scope.closeDetailGame = function(){
		$scope.gameDetailModal.hide();
	};

})
/*controller for game detail page*/
.controller('GameDetailCtrl', function($scope, $stateParams, Game) {
		// get a specific game from database
		Game.getById($stateParams.gameId).then(function(game){
			$scope.game = game;
		});
})


/*controller for scanner*/
/*.controller('ScannerCtrl', function($scope, $cordovaBarcodeScanner, $cordovaToast, EanService, Book, Movie, Game){*/
.controller('ScannerCtrl', function($ionicLoading, $scope, $state, $cordovaBarcodeScanner, $cordovaToast, EanService, Game, $ionicModal){
    // $state.reload();
    $scope.data = {};
    var initAttributes = function(){
	    // attributes for checking the result
	    $scope.searchUpca = "";
	    $scope.online = {
	    	getOnline: false,	//	get result from online
			onlineGame: false,	//	get game from online
			loading: false		
		};
		$scope.localAtt = {
			localGame: false,	//	get game from local
			getLocal: false		//	get result from local
		};
		$scope.data.searchUpca = '';
		var upcaNumber = ''
    };
    
    initAttributes();
    console.log("init by enter view");
    console.log("getOnline:"+$scope.online.getOnline+" onlineGame:"+$scope.online.onlineGame+" loading:"+$scope.online.loading);
    console.log("localGame:"+$scope.localAtt.localGame+" getLocal:"+$scope.localAtt.getLocal);
	
	$ionicModal.fromTemplateUrl('app/barcodeScanner/barcode-result.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openSearchResult = function(gameResult){
		console.log("openSearchResult");
		$scope.gameResult = gameResult;
		$scope.modal.show();
	}

	$scope.closeSearchResult = function(){
		$scope.modal.hide();
	}
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
	/*search from online database if the game does not exist in local database*/
	var searchOnline = function(searchUpca){
		$ionicLoading.show({
		    content: '<i class="icon ion-loading-c"></i>Loading...',
		    animation: 'fade-in',
		    showBackdrop: false,
		});
    	EanService.get({find: searchUpca}, function(response){
    		
            $scope.eanResult = response.product;
            /*recognize if get data from online database or not*/
            if(angular.isUndefined($scope.eanResult.attributes)){
            	$scope.online.loading = false;
            	$cordovaToast.showShortCenter('This game does not exist in the database.').then(function(success) {
	        	}, function (error) {
	        		console.log("The toast was not shown due to " + error);
	        	});
	        	$ionicLoading.hide();
            	return;
            }else{
            	$scope.online.getOnline = true;
            }
            $scope.gameResult = {};
            console.log("get from online: "+$scope.eanResult.attributes.product);
            $scope.gameResult.title = $scope.eanResult.attributes.product;  //	error cannot set of undefined
            /*recognize console from title*/
            if($scope.gameResult.title.search(/Xbox 360/i)!==-1){
            	$scope.gameResult.console = "xbox 360";
            }else if($scope.gameResult.title.search(/Xbox One/i)!==-1){
            	$scope.gameResult.console = "xbox one";
            }else if($scope.gameResult.title.search(/Wii/i)!==-1){
            	if($scope.gameResult.title.search(/Wii U/i)!==-1){
	            	$scope.gameResult.console = "wii u";
	            }else{
	            	$scope.gameResult.console = "wii";
	            }
            }else if($scope.gameResult.title.search(/Playstation 4/i)!==-1){
            	$scope.gameResult.console = "ps4";
            }else if($scope.gameResult.title.search(/Playstation 3/i)!==-1){
            	$scope.gameResult.console = "ps3";
            }else if($scope.gameResult.title.search(/Playstation 2/i)!==-1){
            	$scope.gameResult.console = "ps2";
            }else if($scope.gameResult.title.search(/Playstation/i)!==-1){
            	$scope.gameResult.console = "ps";
            }else if($scope.gameResult.title.search(/pc/i)!==-1){
            	$scope.gameResult.console = "pc";
            }else{
            	$scope.gameResult.console = "choose console";
            }
            /*assign image*/
            $scope.gameResult.image = $scope.eanResult.image;
            /*setup rating*/
            $scope.gameResult.rating = 1;
            /*assign feature if that is existed*/
            if(!angular.isUndefined($scope.eanResult.attributes.features)) {
            	$scope.gameResult.feature = $scope.eanResult.attributes.features;
            	$scope.gameResult.featureDefined = true;
            	$scope.gameResult.featureChecked = false;
            }
            /*assign description if that is existed*/
            if(!angular.isUndefined($scope.eanResult.attributes.long_desc)){
            	$scope.gameResult.description = $scope.eanResult.attributes.long_desc;
            	$scope.gameResult.descriptionDefined = true;
            	$scope.gameResult.descriptionChecked = false;
            }
            $scope.gameResult.upca = $scope.eanResult.UPCA;
            $scope.online.loading = false;
            $ionicLoading.hide();
            $scope.openSearchResult($scope.gameResult);
        });
    };
     function localSearch(upcaNumber){
		Game.getByUpca(upcaNumber).then(function(game){
			$scope.gameResult = game;
			if(angular.isUndefined($scope.gameResult)){
				console.log("no exists in games");
				// if not exists in games, it does not exist in database
	          	console.log("Not Exists in database");
	          	// search the UPCA online
	          	console.log("start to search online");
	          	$scope.online.loading = true;
	          	searchOnline(upcaNumber);
          	}else{
				// the UPCA exists in games table
	          	console.log("existed game");
	          	// assign the attributes
	          	$scope.localAtt.localGame = true;
	          	$scope.localAtt.getLocal = true;
	          	console.log("title: "+$scope.gameResult.title);
	          	//$scope.openSearchResult();
	          	$state.go("app.game-detail", {"gameId": $scope.gameResult.id});
	        }
	    });// game
    };
	// call scanner when scan button is clicked, search if scanner gets the barcode
	/*$scope.scanBarcode = function() {

	};*/
	$scope.scanBarcode = function() {
		initAttributes();
        console.log("init by enter scanBarcode()");
        console.log("getOnline:"+$scope.online.getOnline+" onlineGame:"+$scope.online.onlineGame+" loading:"+$scope.online.loading);
        console.log("localGame:"+$scope.localAtt.localGame+" getLocal:"+$scope.localAtt.getLocal);
		// call scanner
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            // alert(imageData.text);
            // shows the result of barcode - test
            upcaNumber = imageData.text;
            console.log(upcaNumber+"	length: "+upcaNumber.length);
            if(upcaNumber.length<12){
            	// add "0" if length less than 12
            	var numOf0 = 12-upcaNumber.length;
            	for(var i = 0; i<numOf0; i++ ){
            		upcaNumber = "0" + upcaNumber;
            	}
            	
            	console.log("After add 0, "+upcaNumber+"	length: "+upcaNumber.length);
            }
            /*upcaNumber=parseInt(upcaNumber);*/
            $scope.data.searchUpca = upcaNumber;
    		localSearch(upcaNumber);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };

    // search by typing barcode
    $scope.doSearchBarcode = function(upcaNumber){ 
		initAttributes();
        console.log("init by enter doSearchBarcode()");
        console.log("getOnline:"+$scope.online.getOnline+" onlineGame:"+$scope.online.onlineGame+" loading:"+$scope.online.loading);
        console.log("localGame:"+$scope.localAtt.localGame+" getLocal:"+$scope.localAtt.getLocal);
        if(upcaNumber===''){
        	$cordovaToast.showShortCenter('Please enter barcode to search or scan it!').then(function(success) {
        	}, function (error) {
        		console.log("The toast was not shown due to " + error);
        	});
        	return;
        }
        // TODO: search in database first
        localSearch(upcaNumber);
    };

    // add the new game into database
	$scope.insertGame = function(game){
		console.log("inserting game");
		console.log("game rate: "+game.rate);
		Game.insert(game).then(function(result){
	        $scope.result = result;
	        console.log("result:"+result);
	        if($scope.result){
	        	$cordovaToast.showShortCenter('Successfully add to games!').then(function(success) {
	        	}, function (error) {
	        		console.log("The toast was not shown due to " + error);
	        	});
	        	$scope.closeSearchResult();
	        	$state.go('app.games', {}, {reload: true});
	        }else{
	        	$cordovaToast.showShortCenter('The game is added!').then(function(success) {
	        	}, function (error) {
	        		console.log("The toast was not shown due to " + error);
	        	});
	        }
	    });
	};
	// clear search box
	$scope.clearSearchBarcode=function(){
		/*console.log("clearSearchBarcode");*/
		$scope.data.searchUpca = '';
	}
})

.directive('gameRating', function () {
    return {
      restrict: 'A',
      template: '<ul class="rating">' +
                  '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
                      '\u2605' +
                  '</li>' +
                '</ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        onRatingSelected: '&'
      },
      link: function (scope, elem, attrs) {
      	var updateStars = function() {
	        scope.stars = [];
	        for (var i = 0; i < scope.ratingValue; i++) {
	          scope.stars.push({filled: i < scope.ratingValue});
	        }
	    };
	    scope.toggle = function(index) {
		   	scope.ratingValue = index + 1;
    		// scope.onRatingSelected({gameResult.rating: index + 1});
		};
		scope.$watch('ratingValue', function(oldVal, newVal) {
			if(newVal) {
				updateStars();
			}
		});
		
      }
    };
})

.directive('homeRating', function () {
    return {
      restrict: 'A',
      template: "<ul class='rating'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "</ul>",
      scope: {
        ratingValue: '=',
        max: '=',
        onRatingSelected: '&'
      },
      link: function (scope, elem, attrs) {
      	var updateStars = function() {
	        scope.stars = [];
	        for (var i = 0; i < scope.ratingValue; i++) {
	          scope.stars.push({filled: i < scope.ratingValue});
	        }
	    };
	    scope.toggle = function(index) {
		   	scope.ratingValue = index + 1;
    		scope.onRatingSelected({rating: index + 1});
		};
		scope.$watch('ratingValue', function(oldVal, newVal) {
			if(newVal) {
				updateStars();
			}
		});
		
      }
    };
})