// config.js
angular.module('log.config', [])

.constant('DB_CONFIG', {
	name: 'LOG',
	tables: [
		{
			name: 'games',
			columns: [
				{name: 'id', type: 'integer not null primary key autoincrement'},
				{name: 'title', type: 'text not null'},
				{name: 'console', type: 'text'},
				{name: 'upca', type: 'text unique'},
				{name: 'rating', type: 'integer'},
				{name: 'image', type: 'text'},
				{name: 'description', type: 'text'},
				{name: 'feature', type: 'text'}
			]
		}
	]
});