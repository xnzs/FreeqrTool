function goAliCade(img){
	img=img.replace("data:image/png;base64,","");
	//img=encodeURIComponent (img);
	var body={
  "inputs": [
    {
      "image": {
        "dataType": 50,
        "dataValue": img
      }
    }
  ]
};
	$.ajax({  
    type: "POST",  
    url: "http://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json",  
	contentType: "application/x-www-form-urlencoded; charset=utf-8", 
	data:body,
    success: function(data1) {  
        console.log(data1);  
    },  
    beforeSend: function(xhr) {  
       
            xhr.setRequestHeader("Authorization", "APPCODE d9f84dddab444ec1813a4d5d3180f5ac");  
    }  
});  
}
$(window).load(function() {
	var options =
	{
		thumbBox: '.thumbBox',
		spinner: '.spinner',
		imgSrc: 'https://images.aazj.cn/css/qrlogoimg.png'
	}
	var cropper = $('.imageBox').cropbox(options);
	$('#file').on('change', function(re){
		var reader = new FileReader();
		reader.onload = function(e) {
			options.imgSrc = e.target.result;
			cropper = $('.imageBox').cropbox(options);
			autobtnGrop()
		}
		reader.readAsDataURL(this.files[0]);
	//	this.files = [];
	})
	function btnCrop(){
		var img = cropper.getDataURL();
		//$('.cropped').append('<img src="'+img+'">');
		goAliCade(img);
		$('.cropped').html('<img src="'+img+'">');
	$('#logoimg').attr('src',img);
	queryQr();
	};
	$('#btnCrop').on('click', function(){
		btnCrop()
	//var myqrlogimgsrc=img
	$('#upload').on('click', function(){
		 $.post("https://www.aazj.cn/minisns/uploadImageBASE64.json", {"gid":2,"base64":img}, function (data) {
				if (data){
					$(".server").html("<img src='https://images.aazj.cn/"+data.body+"'/>")
				}
			})
})
	})
	function autobtnGrop(){
	setTimeout(function() {
		btnCrop();
	}, 500);
	};
autobtnGrop();
	$('#btnZoomIn').on('click', function(){
		cropper.zoomIn();
		btnCrop()
	})
	$('#btnZoomOut').on('click', function(){
		cropper.zoomOut();
		btnCrop()
	})
            zoomImage = function(e)
            {
               
               btnCrop()
			
            }
});

var myqrsize='300';//二维码的大小：100-600
var LiftOrRight='';//二维码位于左上角或者右上角，right表示右上角，空，表示左上角
var myqrlogimgsrc='https://www.aazj.cn/pc/meeting/img/home_tailogo.png';//二维码中间的本地图片路径,这里必须有
var myqrnote = '^_^';//二维码上面的文字
var myurl="";//二维码的域名或其他信息
var defautQrimgsize='1';//展示大图=1，小图=0
    document.write("<script id='qrfromaazjcn' src='https://images.aazj.cn/js/qrload.js'><\/script>"); 
function queryQr(){
//	var str = toUtf8($("#mytxt").val());
	
var myurl=$("#mytxt").val();
 myqrsize=$("#myqrsize").val();
 if (myqrsize<100||isNaN(myqrsize))
 {
	 myqrsize='300'
 }
$("#qrAnonymous").remove();
qraa (myurl);
	}
