var myApp = new Framework7({
    modalTitle: 'JonaIPhone',
    animateNavBackIcon: true,
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('#view-home', {
    dynamicNavbar: true,
});
var libraryView = myApp.addView('#view-library', {
    dynamicNavbar: true,
});
var settingsView = myApp.addView('#view-settings', {
    dynamicNavbar: true,
});


setFirstRun();
displayInstallAd();
checkFixImages();
updateLibrary();

myApp.onPageBeforeAnimation("install-package", function() {
	populatePackages();
});

myApp.onPageBeforeAnimation("view-library", function() {
	var categoryView = myApp.addView('#view-category', {
		dynamicNavbar: true,
	});
})

function populatePackages(id) {
	console.log('[Mojo Installer] Displaying package..');
	if (localStorage.getItem("asterix_library") === null) {
		$$(".inner-package").html("");
		return;
	}
	catList = '';
	var userRepos = JSON.parse(localStorage.getItem("asterix_library"));
	userRepos.forEach(displayPackage);
}

function displayPackage(element, index, array) {
	var repoRequest = new XMLHttpRequest(); var packageLink = '';
	repoRequest.onreadystatechange = function() {
		if (repoRequest.readyState == 4 && repoRequest.status == 200) {
			var userRepo = '';
			try {
				userRepo = JSON.parse(repoRequest.responseText);
			} catch (e) {
				console.log(e);
				console.log(repoRequest.responseText);
				return;
			}
			for (index = 0; index < userRepo.repository.packages.length; ++index) {
				if (userRepo.repository.packages[index].id == packageId) {
						packageLink = userRepo.repository.packages[index].link;
						var packageTemplate = $$('#packageTemplate').html();
						var compiledPackage = Template7.compile(packageTemplate);
						packList = compiledPackage(userRepo.repository.packages[index]);
						console.log('[Mojo Installer] Loaded package!');
				}
			}
			try {
				$$(".inner-package").html(packList);
			} catch(ex) {
				$$(".inner-package").html('<center style="margin-top:30px;"><i class="fa fa-ban"></i> <h3>Package not found.</h3></center>');
			}
 			$$("#package-install").html('<a href="' + packageLink + '" class="external"><div class="button button-fill button-big" style="background-color: #2b84d2">Add to Library</div></a>');
		}
	}
	repoRequest.open("POST", element, true);
	repoRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	repoRequest.send("repo=" + element);
}

$$('.open-nav').on('click', function () {
    var clickedLink = this;
    myApp.popover('.popover-navigation', clickedLink);
});  

function displayInstallAd() {
	$$(".mojoad").html('<span class="mojoad"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> <!-- Mojo Install Advertisement --> <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1266857843269269" data-ad-slot="4177830439" data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></span>');
}

function purgeDuplicates(arr) {
	console.log('[Leumos] Clearing duplicate repos..');
	var obj = {};
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i]] = true;
	}
	arr = [];
	for (var key in obj) {
		arr.push(key);
	}
	return arr;
}

function setFirstRun() {
	console.log('[Leumos] Checking first run..');
	if (localStorage.getItem("asterix_library") === null) {
		console.log('[Leumos] We found a first run!');
		updateLibrary();
	}
}

$$('.btn-reload').on('click', function () {
// 		myApp.showPreloader('Reloading Data');
		setTimeout(function () {
				myApp.hidePreloader();
		}, 1400);
});

/* ===== Color themes ===== */
myApp.onPageInit('color-themes', function (page) {
    var themes = 'theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray';
    var layouts = 'layout-dark layout-white';
    $$(page.container).find('.ks-color-theme').click(function () {
        $$('body').removeClass(themes).addClass('theme-' + $$(this).attr('data-theme'));
    });
    $$(page.container).find('.ks-layout-theme').click(function () {
        $$('body').removeClass(layouts).addClass('layout-' + $$(this).attr('data-theme'));
    });
});

function checkForUpdatesOnLoad() {
	console.log("[Leumos] Checking for application updates..");
	if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {

	}
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function backfresh() {
	console.log("[Mojo 6] Backfreshing..");
	console.log("[Mojo 6] Cole is a fucking god.");
	$$('.tab.active')[0].f7View.back();
	setTimeout(function() {
		$$('.tab.active')[0].f7View.refreshPage();
		location.reload(false);
	}, 500);
}

function checkFixImages() {
	console.log('[Leumos] Setting all image error events to \'fixBrokenImage()\'');
	$("img").attr('onerror', 'fixBrokenImage(this)');
}

function fixBrokenImage(img) {
	console.log('[Leumos] Broken image found! Fixing..');
	img.onerror = '';
    img.src = "data:image/png;base64,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";
    return true;
}

function updateLibrary() {
		var defRepos = ['https://sharklatan.github.io/tester/library/'];
		localStorage.setItem("library", JSON.stringify(defRepos));
}