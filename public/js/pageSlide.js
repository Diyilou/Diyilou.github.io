(function () {
  console.log('aaaaaaaaaaaaaaa');
  // 
  var config = {
    article: null,
    allPage : 1, // 所有页面
    curPage : 1 // 当前页面

  };

  // 回到顶部
  var $moveTop = $("#diyilouDownTop li:eq(0)"),
      $moveBottom = $("#diyilouDownTop li:eq(1)");

  $moveTop.on('click', function() {
    scrollMove('top');
  });
  $moveBottom.on('click', function() {
    scrollMove('bottom');
  });

  // 控制scroll移动函数
  function scrollMove (dir, sy) {

    var $pageY = $(document).height(),
        scroolY = $(document).scrollTop() > 0 ? sy : 0;
    if (dir === 'top') {
      if (scroolY === 0) {
        return;
      }
      $('html,body').animate({scrollTop: 0}, 500);
    }else if (dir === 'bottom'){
      if (scroolY === $pageY) {
      return;
      }
      $('html,body').animate({scrollTop: $pageY}, 500);
    }
  }
})();