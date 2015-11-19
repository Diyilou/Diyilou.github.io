(function () {
	exports.htmlModel = {
		// 头部html
		'headerModel': function () {
			return "<html>"+
								"<head>"+
									"<meta charset='utf-8' />"+
									'<meta http-equiv="X-UA-Compatible" content="chrome=1">'+
									"<title>Diyilou博客</title>"+
									'<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">'+
									'<link rel="stylesheet" type="text/css" href="../../../css/bootstrap.css">'+
									'<link rel="stylesheet" type="text/css" href="../../../css/style.css">'+
								"</head>"+
								"<body>"+
									"<header class='diyilou-header'>"+
										"<nav>"+
											"<ul>"+
												'<li><a href="../../../../index.html">Diyilou <span>博客</span></a></li>'+
											'</ul>'+
										'</nav>'+
									'</header>';
		},
		// 底部html
		'footerModel': function () {
			return "<div class='diyilou-down-top' id='diyilouDownTop'>"+
							"<ul>"+
								"<li><span class='glyphicon glyphicon-chevron-up'></span></li>"+
								"<li><span class='glyphicon glyphicon-chevron-down'></span></li>"+
							"</ul>"+
						"</div>"+
						"<footer class='diyilou-footer'>"+
							"© Diyilou&nbsp;&nbsp;&nbsp;&nbsp;contact me: mnzmx_z@163.com"+
						"</footer>"+
						"<script type='text/javascript' src='../../../js/jquery.min.js'></script>"+
						"<script type='text/javascript' src='../../../js/pageSlide.js'></script>"+
					"</body>"+
				"</html>";
		},
		// 简略文章信息html
		'briefModel': function (brief) {
			return "<div class='diyilou-brief-message'>"+
									"<h3><a class='diyilou-a-tag' href='"+brief.url+"'>"+brief.title+"</a></h3>"+
									"<p>"+brief.brief+"</p>"+
									"<h4>"+
										"<span>日期:</span><span>"+brief.date+"</span>"+
										"<span>类别:</span><span>"+brief.tag+"</span>"+
										"<a class='diyilou-a-tag' href='"+brief.url+"'>查看</a>"+
									"</h4>"+
								"</div>";
		},
		// 完整的文章html
		'articleModel': function (art, con) {
			return "<section class='diyilou-setion-article' id='diyilouSectionArticle'>"+
								"<h3 class='diyilou-setion-article-h3'>"+
									art.title+
								"</h3>"+
								"<h4 class='diyilou-setion-article-h4'>"+
									"<span>日期: "+art.date+"</span>"+
									"<span>类别: "+art.tag+"</span>"+
								"</h4>"+
									con+
							"</section>";
		}
	};
})();