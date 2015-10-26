'use strict';
var gulp = require('gulp');
var glob = require('glob');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var combinedStream = require('combined-stream');
var reactify = require('reactify');
var os = require('os');
var path = require('path');

var paths = {
	src: {
		viewComponets: 'Scripts/App/ViewComponents',
		uiComponents: 'Scripts/App/UIComponents',
		jsx: 'Scripts/App/ViewComponents/**/*.jsx',
		scripts: 'Scripts/**/*.js'
	},
	dest: {
		bundles: 'Scripts/bundles',
		jsx: 'Scripts/App/Components',
		bundlesFilter: '!Scripts/dist/**/*.js',
		serverBundle: 'server.js',
		vendorBundle: 'vendor.js'
	}
};

gulp.task('vendor', function() {
	var b = browserify({
		debug: false
	});

	var libs = getVendorLibs();
	var vendorsConfig = require('./vendorsConfig.json');
	var exposedVariables = combinedStream.create();
	libs.forEach(function(l) {
		b.require(l.require);
		exposedVariables.append('var ' + l.expose + ' = require("' + l.require + '");' + os.EOL);
	});

	return saveBundle(b, exposedVariables, paths.dest.vendorBundle, paths.dest.bundles);
});

gulp.task('components', function() {
	var viewComponets = getViewComponents();
	var libs = getVendorLibs();

	viewComponets.forEach(function(c) {
		var b = browserify();
		b.transform(reactify);

		b.require(c.fullPath, {
			expose: c.name
		});

		libs.forEach(function(l) {
			b.external(l.expose);
		})

		var exposedVariables = combinedStream.create();
		exposedVariables.append('var ' + c.name + ' = React.createFactory(require("' + c.name + '"));' + os.EOL);

		return saveBundle(b, exposedVariables, c.name + '.js', c.destDir);
	})
})

gulp.task('server', function() {
	var viewComponets = getViewComponents();

	var b = browserify();
	b.transform(reactify);

	var libs = getVendorLibs();
	libs.forEach(function(l) {
		b.external(l.expose);
	})

	var exposedVariables = combinedStream.create();
	viewComponets.forEach(function(c) {
		b.require(c.fullPath, {
			expose: c.name
		});
		exposedVariables.append('var ' + c.name + ' = React.createFactory(require("' + c.name + '"));' + os.EOL);
	})

	return saveBundle(b, exposedVariables, paths.dest.serverBundle, paths.dest.bundles);
})

gulp.task('default', ['vendor', 'components', 'server']);

function saveBundle(b, vars, sourceName, dest) {

	var bundleStream = combinedStream.create();
	bundleStream.append(b.bundle());
	bundleStream.append(vars);

	return bundleStream
		.pipe(source(sourceName))
		.pipe(gulp.dest(dest));
}

function getViewComponents() {
	var viewComponetFiles = glob.sync(paths.src.jsx);
	var viewComponets = [];
	viewComponetFiles.forEach(function(filename) {
		var fullPath = path.resolve(filename);
		var componentName = path.basename(filename, path.extname(filename));
		var relativePath = path.relative(paths.src.viewComponets, path.dirname(filename));
		var dest = path.resolve(paths.dest.bundles, relativePath);

		viewComponets.push({
			name: componentName,
			fullPath: fullPath,
			relativePath: relativePath,
			destDir: dest
		})
	});
	return viewComponets;
}

function getVendorLibs() {
	var vendorsConfig = require('./vendorsConfig.json');
	var libs = [];
	for (var nameIndex in vendorsConfig.expose) {
		var module = vendorsConfig.expose[nameIndex];
		var requireName, exposeName;
		if (typeof module === 'string') {
			requireName = exposeName = module;
		} else {
			requireName = module.require;
			exposeName = module.expose;
		}
		libs.push({
			require: requireName,
			expose: exposeName
		});
	}
	return libs;
}