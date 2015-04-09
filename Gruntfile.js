module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			htdocs: {
				files: {
					'htdocs/style.css' : 'dev/sass/main.scss'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'htdocs/app.js': ['dev/angular/*.js']
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			},
			js: {
				files: ['dev/angular/*.js'],
				tasks: ['uglify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['watch']);
}