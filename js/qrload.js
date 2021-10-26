var myqrsize;
var myqrlogimgsrc;
var myqrnote ;
var myurl;
var LiftOrRight;
var myqrtop;
if (!myqrnote)
{
var myqrnote = "";
}
if (!myqrsize)
{
myqrsize = 280;
}

if (LiftOrRight&&LiftOrRight=='left')
{
	LiftOrRight='left:5px;'
}else{
	LiftOrRight='right:10px;'
}

if (myqrtop&&myqrtop<=100)
{
	myqrtop='top:'+myqrtop+'%;'
}else{
	myqrtop='top:10px;'
}


function loadqraa ()
{
    var oHead = document.getElementsByTagName('body').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "js/qraa.js";
    oHead.appendChild(oScript);
}
function loadjquery()
{
    var oHead = document.getElementsByTagName('body').item(0);
    var qoScript = document.createElement("script");
    qoScript.type = "text/javascript";
    qoScript.id = "qrJquery";
    qoScript.src = "js/jquery-1.9.1.js";
    oHead.appendChild(qoScript);
}
function qrloadjs()
{
	window.onload = function () {
        var as = document.getElementsByTagName('script');
        for(var i=0,j=as.length;i<j;i++){
			var jsSrc=as[i].src;
			if (jsSrc.indexOf("jquery")>=0)
			{
				 loadqraa ();
				 return;
			}
		}
    
    if (typeof jQuery == 'undefined') {
        loadjquery();
    }
    else {
        loadqraa ();
        return;
    }
    loadqraa ();

    }


}
qrloadjs();
