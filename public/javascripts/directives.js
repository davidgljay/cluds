angular.module('d3Display', ['d3'])
	.directive('cludsvis', ['d3Service', function (d3Service, $window) {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {

				//Inject an SVG element to hold the graph
	          	var svg = d3.select(element[0])
        		.append("svg")
        		.style('width', '100%')
        		.append('g');



            	 // Watch for a browser resize and redraw
		          window.onresize = function() {
		            scope.$apply();
		          };

		          scope.$watch(function() {
		            return angular.element($window).innerWidth;
		          }, function() {
		            scope.render(scope.data);
		          });

		          scope.render = function(data) {
					

		          	//Disabling robot backgrounds for now.
		          	//Get background image.
		      //     	  switch (scope.icon) {
					   // 	case 'clear-day':
					   // 		background = 'sun-robot.jpg'
					   // 		break;
					   // 	case 'cloudy':
					   // 		background = 'robot-cloud.png'
					   // 	case 'partly-cloudy-day':
					   // 		background = 'robot-cloud.png'
					   // 		break;
					   // 	case 'rain':
					   // 		background = 'robot-rain.jpg'
					   // 		break;
					   // 	case 'partly-cloudy-night':
					   // 	case 'clear night':
					   // 		background = 'robot-night.jpg'
					   // 		break;
					   // 	default:
					   // 		background = 'robot-default.png'
					   // };


					//d3.select(element[0].children[0]).style('background-image', "url('./images/" + background + "')");

		          	//Clear in case of rerender
		          	svg.selectAll('*').remove();

		          	// If we don't pass any data, return out of the element
    				if (!data) return;

    				var margin = {top: 20, right: 20, bottom: 30, left: 50},
    				width = 960 - margin.left - margin.right,
    				height = 500 - margin.top - margin.bottom;


					var x = d3.time.scale()
					    .range([0, width]);

					var y = d3.scale.linear()
					    .range([height, 0]);

					var xAxis = d3.svg.axis()
					    .scale(x)
					    .orient("bottom");

					var cover = d3.svg.area()
						.interpolate("monotone") 
					    .x(function(d) { return x(d.hour); })
					    .y0(height)
					    .y1(function(d) { return y(d.cover); });

					var precip = d3.svg.area()
						.interpolate("monotone") 
					    .x(function(d) { return x(d.hour); })
					    .y0(height)
					    .y1(function(d) { return y(d.precip); });

					  data.forEach(function(d) {
					    d.hour = new Date(d.hour);
					  });

					  x.domain(d3.extent(data, function(d) { return d.hour; }));
					  y.domain([0, d3.max(data, function(d) { return d.cover; })]);

					  svg.append("path")
					      .datum(data)
					      .attr("class", "area")
					      .style("fill", "rgba(108, 140, 213, 0.75)")
					      .attr("d", cover);

					  svg.append("path")
					  	 .datum(data)
					      .attr("class", "line")
					      .style("fill", "rgba(6, 38, 111, 0.75)")
					      .attr("d", precip);

					  svg.append("g")
					      .attr("class", "x axis")
					      .style("fill", "grey")
					      .attr("transform", "translate(0," + height + ")")
					      .call(xAxis);

					 

		          };

		          scope.cludsPromise.then(function () {scope.render(scope.cluds)});

			}
		}
}]);