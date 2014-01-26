app.controller('cludsController', function ($scope, $http, geolocation, $q) {
	$scope.header = 'Loading your cludds now...';

	var cludsDeferred = $q.defer();

	geolocation.getLocation().then(function(location) {
		console.log(location);
	});

	$http.get('/cluds.json').success(function(data) {
		$scope.cluds = data.cluds.slice(0,12);
		$scope.header = '';
		$scope.icon = data.icon;
		console.log($scope.icon);
		cludsDeferred.resolve()
	}).error(function(err) {
		console.log('Error: ' + err);
	}) 

	$scope.cludsPromise = cludsDeferred.promise;

});