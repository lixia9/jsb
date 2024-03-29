/**
 * 
 * @author lixiaolong
 * @description native to web and web to native for get info and changeinfo
 */
(function(window) {

	'use strict';

	var callbackList = [];
	var baseConfig = {
		scheme: "appTest",
		debuger: true

	}



	var postUrl = function(strUrl, param, callid) {
		var Test = {};
		Test.callbackId = callid;
		Test.name = strUrl;
		Test.param = param;
        log(Test.name, Test);
	
		if(navigator.userAgent.match(/Test/i) ? true : false) {
			var appVersion  ="0.0.0" ;
			var ua = navigator.userAgent.split("/");
			for(var i = 0 ; i <ua.length; i++){
				if(ua[i].indexOf("Test")>-1){
					appVersion = JSON.parse(ua[i].substring(5)).version
				}
			}
		  
			if(param.version > appVersion) {
				TestJSB.callbyNative(JSON.stringify({"callbackId":callid,data:{text:strUrl + "方法只能在大于等于" + param.version + "的版本中使用"}}))
				return;
			}
            if(!Test.param.useScheme){
            	 if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
            	 	window.webkit.messageHandlers[baseConfig.scheme+Test.name].postMessage(JSON.stringify(Test));
            	 }else{
            	 	window[baseConfig.scheme][Test.name](JSON.stringify(Test));
            	 }
            }else{
            		var c = document.createElement("div")
			c.innerHTML = '<iframe style="display: none;" src="' + baseConfig.scheme+"://" +
				encodeURIComponent(JSON.stringify(Test)) + '"/>'
			document.querySelector("body").appendChild(c)
			setTimeout(function() {
				document.querySelector("body").removeChild(c)
			}, 3000)
            }
		

		}
	}
	
	var mergeObjs = function(def, obj) {

		if(!Object.assign) {
			Object.defineProperty(Object, "assign", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: function(target, firstSource) {
					"use strict";
					if(target === undefined || target === null)
						throw new TypeError("Cannot convert first argument to object");
					var to = Object(target);
					for(var i = 1; i < arguments.length; i++) {
						var nextSource = arguments[i];
						if(nextSource === undefined || nextSource === null) continue;
						var keysArray = Object.keys(Object(nextSource));
						for(var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
							var nextKey = keysArray[nextIndex];
							var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
							if(desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
						}
					}
					return to;
				}
			});
		}
		return Object.assign(def, obj)
	}

	var jsb = function(target, option, param, cf, f1, f2) {
		var callid = callbackList.length;
		if(typeof arguments[1] !== "function") {
			param = mergeObjs(param, option)
		} else if(typeof arguments[1] == "function") {
			cf = arguments[1];
		}
		if(!cf) {
			cf = new Function();
		}

		callbackListFunction(callid, cf)
		switch(target) {
			case "initRightBtn":
				param.clickObj.callbackId = callbackList.length;
				callbackListFunction(param.clickObj.callbackId, param.clickObj.callback || new Function())
				break;
			default:
				break;
		}
	
		postUrl(target, param, callid)
	}

	var config = {
		camera: {
			version: "0.0.1",
			name: "camera",
			description:"调用手机拍照"
		},
		
		
		qrcode: {
			version: "0.0.1",
			name: "qrcode",
			description:"二维码扫描"
		},
		barcode: {
			version: "0.0.1",
			name: "barcode",
			description:"条形码扫描"
		},
		qrcodeImage: {
			version: "0.0.1",
			name: "qrcodeImage",
			description:"二维码从手机选择识别"
		},
		tel: {
			version: "0.0.1",
			name: "tel",
			description:"打电话"
		},
		email: {
			version: "0.0.1",
			name: "email",
			description:"发邮件"
		},
		sms: {
			version: "0.0.1",
			name: "sms",
			description:"发短信"
		},
		geolocation: {
			version: "0.0.1",
			name: "geolocation",
			description:"获取经纬度"
		},
		dialog: {
			version: "0.0.1",
			name: "dialog",
			description:"弹出框"
		},
		toast: {
			version: "0.0.1",
			name: "toast",
			description:"提示"
		},
		loading: {
			version: "0.0.1",
			name: "loading",
			description:"加载中"
		},
		
		redirect: {
			version: "0.0.1",
			name: "redirect",
			description:"打开原生界面"
		},
		
		shareInfo: {
			version: "0.0.1",
			name: "shareInfo",
			description:"分享"
		},
		closeWebview: {
			version: "0.0.1",
			name: "closeWebview",
			description:"关闭Webview"
		},
		newWebview: {
			version: "0.0.1",
			name: "newWebview",
			description:"打开Webview"
		},
		uploadImage: {
			version: "0.0.1",
			name: "uploadImage",
			description:"图片上传"
		}
		
	};

	var TestJSB = {
		callbyNative: function(o) {
			nativeCallback(o)
		},
		init: init,
		setObj:setObj

	};
    function setObj(key){
    	if(key){
			baseConfig.scheme=key;
		}
    }
	function init() {
		
		if(!Object.keys) {
			Object.keys = (function() {
				var hasOwnProperty = Object.prototype.hasOwnProperty,
					hasDontEnumBug = !({
						toString: null
					}).propertyIsEnumerable('toString'),
					dontEnums = [
						'toString',
						'toLocaleString',
						'valueOf',
						'hasOwnProperty',
						'isPrototypeOf',
						'propertyIsEnumerable',
						'constructor'
					],
					dontEnumsLength = dontEnums.length;

				return function(obj) {
					if(typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

					var result = [];

					for(var prop in obj) {
						if(hasOwnProperty.call(obj, prop)) result.push(prop);
					}

					if(hasDontEnumBug) {
						for(var i = 0; i < dontEnumsLength; i++) {
							if(hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
						}
					}
					return result;
				}
			})()
		};

		Object.keys(config).forEach(function(key) {
			TestJSB[key] = function(option, cf) {
				var param = config[key]
				jsb(config[key].name, option, param, cf);
			}
		});
	}

	function callbackListFunction(callid, cf) {
		callbackList[callid] = cf || new Function();

	}

	function nativeCallback(result) {
		
		console.log(result)
         var result = JSON.parse(result);
  		callbackList[result.callbackId * 1](result);

	}

	function log(name, param) {
		if(baseConfig.debuger) {
			console.log("调用的方法是--->" + name);
			console.log("调用的参数是 --->" + JSON.stringify(param));
		}
		/*	layer.open({
				content: msg,
				time: 2
			});*/

	}
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(TestJSB);
	} else {
		window.TestJSB = TestJSB;
	}




})(window);

TestJSB.init();