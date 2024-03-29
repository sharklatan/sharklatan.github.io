var app = new Framework7({
	root: '#app',
	name: 'SharkLatan',
	id: 'com.sharklatan.app',
	theme: 'ios',
	routes: [{
		path: '/ota/',
		url: 'page.html',
	}, {
		path: '/apps/',
		url: 'apps.html',
	}, {
		path: '/appstore/',
		url: 'appstore.html',
	}, {
		path: '/tweakbox/',
		url: 'tweakbox.html',
	}, {
		path: '/tweaked/',
		url: 'tweaked.html',
	}, {
		path: '/games/',
		url: 'games.html',
	}, ]
});
var $$ = Dom7;
$$(window).on('load', function () {
	var formData = app.form.convertToData('#shark-theme');
	if (formData['switch'] == 'yes') {
		$$('body').removeClass('theme-dark');
	} else if (formData['switch'] == '') {
		$$('body').addClass('theme-dark');
	}
});
$$('#toggle-theme').on('click', function () {
	$$('body').toggleClass('theme-dark');
});
var mainView = app.views.create('.view-main');