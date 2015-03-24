// services.js

angular.module('log.services', ['ngResource', 'ngCordova', 'log.config'])
// database wrapper
.factory('DB', function($q, DB_CONFIG){
	var self = this;
	self.db = null;

	self.init = function() {
        var q = $q.defer();
        console.log("initing db");
        // Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
        
        if(window.cordova)
            self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});
        else
            self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
 
        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];
 
            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });
 
            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            self.query(query);
            console.log('Table ' + table.name + ' initialized');
        });

        q.resolve();

        return q.promise;
    };
 
    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();
 
        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });
 
        return deferred.promise;
    };
 
    self.fetchAll = function(result) {
        var output = [];
 
        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    };
 
    self.fetch = function(result) {
        return result.rows.item(0);
    };
 	
    self.isSuccess = function(result){
        console.log("result.rowsAffected:"+result.rowsAffected);
    	return result.rowsAffected>0 ? true : false;
    };

    return self;
})
// Games database operator
.factory('Game', function(DB){
	var self = this;
    
    self.all = function() {
        console.log("select all games");
        return DB.query('SELECT * FROM games')
        .then(function(result){
            return DB.fetchAll(result);
        });
    };
    
    self.getById = function(id) {
        console.log("search by id:"+id);
        return DB.query('SELECT * FROM games WHERE id = ?', [id])
        .then(function(result){
            return DB.fetch(result);
        });
    };

    self.getByUpca = function(upca) {
        console.log("search by upca:"+upca);
        return DB.query('SELECT * FROM games WHERE upca = ?', [upca])
        .then(function(result){
            return DB.fetch(result);
        });
    };

    self.updateGame = function(game){
        console.log("update game");
    	if(angular.isUndefined(game.feature)){
    		game.feature = "";
    	}
    	if(angular.isUndefined(game.description)){
    		game.description = "";
    	}
    	return DB.query('UPDATE games SET title=?, console=?, rating=?, description=?, feature=? WHERE id = ?', [game.title, game.console, game.rating, game.description, game.feature, game.id])
        .then(function(result){
            return DB.isSuccess(result);
        });
    };

    self.deleteById = function(id){
        console.log("delect game id->"+id);
    	return DB.query('DELETE FROM games WHERE id = ?', [id])
        .then(function(result){
            return DB.isSuccess(result);
        });
    };
    
    self.insert = function(game){
        console.log("service insert function");
    	return DB.query('INSERT INTO games (title, console, upca, rating, image, description, feature) VALUES (?, ?, ?, ?, ?, ?, ?)', [game.title, game.console, game.upca, game.rating, game.image, game.description, game.feature])
        .then(function(result){
            return DB.isSuccess(result);
        });
    };

    return self;
})

// barcode search for everything
.factory('EanService', function ($resource) {
    return $resource('http://eandata.com/feed/?v=3',
        {keycode: '8210A2C554B86445', mode: "json"},
        { get: { method: 'GET' }
        });
})

