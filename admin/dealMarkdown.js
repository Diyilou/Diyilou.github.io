(function () {

	// 引用模块
	var fs = require('fs'),
			markdown = require('markdown').markdown,
			htmlModel = require('./view/htmlModel.js').htmlModel; // 获得html模板
	// 配置信息
	var date = new Date();
	var _config = {
		'mdDir': 'source/_post', // 存放 .md文件的根目录
		'htmlDir': 'public', // 存放html文件的目录
		'briefUrl': 'public/js/urlData.js', //存放briefhtmlModel模板的路径
		'date': {
			'year': date.getFullYear(),
			'month': (parseInt(date.getMonth())+1).toString(),
			'day': date.getDate()
		}
	};

	// 初始化文件
	exports.init = function () {
		readMdFile();
	};

	// 存储简略的briefhtmlmodel模板路径
	var saveBriefUrl = {
		'urlArr' : [],
		'getBriefUrl': function () {
			var data = 'var urlMsg = [';
			for (var i = 0, len = this.urlArr.length; i < len; i++) {
				if (i < this.urlArr.length -1) {
					data += '"'+this.urlArr[i]+'",';
				}else {
					data += '"'+this.urlArr[i]+'"]';
				}
			}
			fs.writeFileSync(_config.briefUrl,data);
		},
		'setBriefUrl': function (data) {
			var msg = /brief/g;
			if (msg.test(data)) { // 只获取 brief 信息的路劲
				if (this.urlArr.indexOf(data) === -1) { // 同一个路径不能重复保存
					this.urlArr.push(data);
				}
			}
		}
	};

	// 读取md文件
	function readMdFile () {

		fs.readdir(_config.mdDir, function (err, data) {
			if (err) {
				throw err;
			}

			var i = 0, len =data.length;
			for (; i < len; i++) {

				var fileExists = checkRepeat(); // 获取已经被解析的md文件		
				var fileName = data[i].split(".")[0];
 				// 检查当前读取到的 md 文件是否被解析过
				if (fileExists.indexOf(fileName) === -1) {
					// 如果当前md文件没有被解析，就生成相应的html文件存放目录			
					createHtmlDir(_config.mdDir+'/'+data[i], data[i].split(".")[0]);
				}else {
					saveBriefUrl.getBriefUrl();
					console.log(data[i]+"已经成功转化为相应的html文件");
				}
			}
		});
	}

	/**
	*	检查文件目录，并生成新的html文件目录
	* {param1: 'md文件的存放路径', param2: 'md文件名称，不包含.md后缀'}
	*/
	function createHtmlDir (mdUrl, mdFileName) {
		var firstDir = _config.htmlDir + '/' + _config.date.year,
				secondDir = firstDir + '/' + _config.date.month,
				threeDir = secondDir + '/' + _config.date.day;

		// 检测一级目录是否存在
		fs.exists(firstDir, function(exists1) {
			if (exists1) {

				// 检测二级目录是否存在
				fs.exists(secondDir, function (exists2) {
					if (exists2) {

						// 检测三级目录是否存在
						fs.exists(threeDir, function (exists3) {
							if (exists3) {
								checkMdFile(mdUrl, mdFileName);
							}else {
								fs.mkdir(threeDir, function(status) {
									checkMdFile(mdUrl, mdFileName);
								});
							}
						});
					}else {
						fs.mkdir(secondDir, function(status) {
							fs.mkdir(threeDir, function(status) {
								checkMdFile(mdUrl, mdFileName);
							});
						});
					}
				});
			}else {
				fs.mkdir(firstDir, function(status) {
					fs.mkdir(secondDir, function(status) {
						fs.mkdir(threeDir, function(status) {
							checkMdFile(mdUrl, mdFileName);
						});
					});
				});
			}
		});
	}

	/**
	 * 检查每个md文件获得文件内容
	 * param 和 createHtmlDir 函数的参数一样
	 */
	function checkMdFile (mdUrl, mdFileName) {

		var date = _config.date;
		// html文件存放路径
		var curUrl = _config.htmlDir + '/' + date.year + '/' + date.month + '/' + date.day + '/';

		fs.readFile(mdUrl, function (err, data) {
			if (err) {
				throw err;
			}

			var mdContent = data.toString().split("------"),
					titleMsg = mdContent[0],
					articleMsg = mdContent[1];
			// 处理获得简略信息的html
			dealBriefContent(titleMsg, mdFileName);
			// 处理获得文章的主要内容
			dealArticleContent(curUrl +(mdFileName.split(".")[0])+".html", articleMsg, titleMsg);
		});
	}

	/**
	 * 处理要存储在首页中的简略信息
	 * {param1: '从md文件中获得的简略信息的全部', param2: 'md文件的文件名'}
	 */
	function dealBriefContent (briefMsg, mdFileName) {
		var con = briefMsg.split('\r\n');
		var date = _config.date;

		var message = {
			'title': con[0].split(":")[1],
			'tag': con[1].split(":")[1],
			'brief': con[2].split(":")[1],
			'date': date.year+"/"+date.month+"/"+date.day,
			'url': _config.htmlDir+'/'+date.year+'/'+date.month+'/'+date.day+'/'+mdFileName+".html"
		};

		var briefModel = htmlModel.briefModel(message); // 这里引用 htmlModel 模板
		var dirUrl = _config.htmlDir+'/'+date.year+'/'+date.month+'/'+date.day+'/'+mdFileName+"_brief.html";
		saveBriefUrl.setBriefUrl(dirUrl);
		saveBriefUrl.getBriefUrl();
		createHtmlModel(dirUrl, briefModel);
	}

	/**
	 * 处理完整文章需要显示的信息
	 * {param1:'文章存储的路径', param2:'所有的文章信息', param: '简略的文章信息'}
	 */
	function dealArticleContent (url, articleMsg, briefMsg) {
		var con = briefMsg.split('\r\n');
		var date = _config.date;

		var art = {
			'title': con[0].split(":")[1],
			'tag': con[1].split(":")[1],
			'date': date.year+"/"+date.month+"/"+date.day
		};

		var articleHtml = htmlModel.headerModel()+htmlModel.articleModel(art, markdown.toHTML(articleMsg))+htmlModel.footerModel();
		createHtmlModel(url, articleHtml);
	}

	/**
	 * 最终生成相应的html文件
	 */
	function createHtmlModel (dir, htmlContent) {
		fs.writeFile(dir, htmlContent, function (err) {

			if (err) {
				throw err;
			}
			console.log(dir+'创建成功！');
		});
	}

	// 检查是否有重复文件，防止同一个md文件在不同日期创建多次
	function checkRepeat () {
		var file = [];
		var data1 = fs.readdirSync(_config.htmlDir);
		for (var i = 0, len = data1.length; i < len; i++) {
			if (parseInt(data1[i])) {
				var url1 = _config.htmlDir + '/' + data1[i];
				var data2 = fs.readdirSync(url1);

				for (var j = 0, len1 = data2.length; j < len1; j++) {
					var url2 = url1 + '/' + data2[j];
					var data3 = fs.readdirSync(url2);
				
					for (var k = 0, len2 = data3.length; k < len2; k++) {
						var url3 =url2 + '/' + data3[k];
						var data4 = fs.readdirSync(url3);
						for (var h = 0, len3 = data4.length; h < len3; h++) {
							saveBriefUrl.setBriefUrl(url3+'/'+(data4[h].split('.')[0]).toString()+".html");
							file.push((data4[h].split('.')[0]).toString());
						}
					}
				}
			}
		}
		return file;
	}
})();