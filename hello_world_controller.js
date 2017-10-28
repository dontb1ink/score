function keep(){
  var original = arguments[0]
  var selection = Array.prototype.slice.call(arguments, 1)
  return selection.reduce((elem, key) => Object.assign(elem, {[key]: original[key]}), {})
}

function getContests(sportsData){
  // Shed
  var layer1 = sportsData.map(x => x.leagues)
  // Flatten
  var leagues = [].concat.apply([],layer1)
  // Trim
  var trimmedLeagues = leagues.map(x => keep(x, 'name', 'events'))
  // Move
  var groupedEvents = trimmedLeagues.map( x => x.events.map(y => Object.assign(y, {['league']: x.name})))
  // Flatten
  var events = [].concat.apply([], groupedEvents)
  return events
}

function getVideo(contest){
  return contest
}

function applyTemplate(contest, template){
  return Object.keys(template).map( x => template[x].apply(contest))
}

function get(object, value){
  if(object && object[value])
    return object[value]
  else
    return null
}

function parse(sportsData) {
  var contests = getContests(sportsData)


  var template = {
    summary() { return {'s': get(this, 'summary'), f(){return 2} }}, 
    odds() { return get(get(this, 'odds'), 'details') }
  }
  var test = Object.keys(template).reduce( (a, b) => Object.assign(a, {[b]:template[b].apply(contests[0])}), {"fat": "yo"})
  console.log(test)
  var contests2 = contests.map( x => applyTemplate(x, template))



  console.log(contests)
	console.log(contests2)
	return contests
}
angular.module('demo', [])
.controller('Hello', function($scope, $http) {
    $http.get('http://site.api.espn.com/apis/v2/scoreboard/header').
        then(function(response) {
            // $scope.json = JSON.parse(response.data);
           $scope.r = parse(response.data.sports)

        });
});


/*
var person = {
    firstName:"John",
    lastName: "Doe",
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
}
var myObject = {
    firstName:"Mary",
    lastName: "Doe",
}
person.fullName.apply(myObject);  // Will return "Mary Doe"
*/