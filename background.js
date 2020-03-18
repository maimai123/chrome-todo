console.log('background.js');
let url = 'http://192.168.31.194:8002';

let cookie;


chrome.cookies.get({
	url: 'http://192.168.31.221',
	name: 'SESSION'
}, function (cookie) {
	cookie = cookie.value;
});

// chrome.cookies.get({
// 	url: 'localhost:8000',
// 	name: 'token',
// }, function (cookie) {
// 	console.log(cookie);
// 	token = cookie;
// });

// chrome.webRequest.onHeadersReceived.addListener(function(details){
// 	const headers = details.responseHeaders;
// 		console.dir(details);
//     return true;
//   },
//   {urls: ["<all_urls>"]},
//   ["responseHeaders", "blocking"]
// );
function fetchUserInfo () {
	return fetchData(url + '/api/user/getUserInfo');
}

function fetchWeekList () {
	return fetchData(url + '/api/plugIn/getPlugInDate');
}

function fetchRemindData (date = '') {
	return fetchData(url + '/api/home/getRemindData?date=' + date);
}

function fetchData (url) {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method:'GET',
			credentials: 'include',
			headers: {
				Authorization: 'admin',
				Cookie: cookie
			}
		})
		.then(async function(response) {
			const { data } = await response.json();
			resolve(data);
		})
		.catch(function(err){
			console.log("err:" + err);
			reject(err);
		});
	})
}
