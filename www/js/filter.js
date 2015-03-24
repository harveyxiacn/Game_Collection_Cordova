// filter.js
angular.module('log.filters', [])
// filter for author from google book api
.filter('formatFilter', function () {
    return function (text) {
        if (text !== null) {
            for (var i in text) {var authors = text[i]}    
            return authors;
        }   
    };
})

// filter for publish date from google book api
.filter('dateFilter', function () {
    return function (text) {
        if (text !== null) {
            var d = new Date(text);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            return (month +"/"+ day +"/"+ year);
        }   
    };
})
// filter for trust the json code as html
.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);