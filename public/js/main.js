(function () {
	
	var urlData = urlMsg;
  var $dsb = $("#diyilouSectionBrief");

  var divCon = '';
  for (var i = 0, len = urlData.length - 1; len >= i; len--) {
    ajax(urlData[len], function(data) {
      $dsb.append(data);
    });
  }

  function ajax (url, callback) {
    $.ajax({
      url: url,
      dataType:'html',
      async: false,
      success: function (data) {
          callback(data);
      },
      error: function(xhr, type){
          callback(type);
      }
    });
  }
})();