var appValues = {
    "positionCrop" : {
           
        }, 

    "scale":1,
    "imagePostionAfterScale" : 0
}

var mainScript = {

    getImagePosition: function() {
    	var p = $("#zoom");
    	//get top and left
	    var position = p.position();

	    //calculate right and bottom
    	var positionRight = p.height() + position.left;
    	var positionBottom = p.height() + position.top;

    	var arrayPosition = {
    		'left': position.left,
    		'top' : position.top, 
    		'right' : positionRight - 4, 
    		'bottom' : positionBottom - 4
    	}

        appValues.imagePostionAfterScale =  $("#image").position();
	    
	    return arrayPosition;
    },

    getImageSize: function(){
    	var p = $("#zoom");
    	var imageHeight = p.height();
    	var imageWidth = p.width();

    	arraySize = {
    		'width' : imageWidth,
    		'height' : imageHeight
    	};

   
    	return arraySize;
    },

    getAllData : function(){
        var imagePostion = this.getImagePosition();

        var returnedArray = {
            "cropPosition" : {
                "top" : Math.round(Math.abs(Math.abs(imagePostion.top) - (Math.abs(appValues.imagePostionAfterScale.top) + Math.abs(appValues.positionCrop.top)))),
                "left" : Math.round(Math.abs(Math.abs(imagePostion.left) - (Math.abs(appValues.imagePostionAfterScale.left) + Math.abs(appValues.positionCrop.left))))
            },

            "imageSize" : {
                "width" :Math.round((imagePostion.right - imagePostion.left) * appValues.scale),
                "height" :Math.round((imagePostion.bottom - imagePostion.top) * appValues.scale),
                "top" : Math.round(Math.abs(Math.abs(imagePostion.top) - (Math.abs(appValues.imagePostionAfterScale.top)))),
                "left" : Math.round(Math.abs(Math.abs(imagePostion.left) - (Math.abs(appValues.imagePostionAfterScale.left))))
            }

            // in case of emergency

        }
        $( "#infos" ).text( "image top : "+ returnedArray.imageSize.top +" / image left : "+returnedArray.imageSize.left +" / width : "+returnedArray.imageSize.width+" / height : "+returnedArray.imageSize.height );
        console.log(returnedArray);
        return returnedArray;
    },

    getRectanglePosition : function(){
    	return appValues.positionCrop;
    },

    isPhotoInRectangle: function() {
    	var arrayRectangle = this.getRectanglePosition();
    	var arrayPostion = this.getImagePosition();
    	//var bool = false;

    	if( arrayRectangle.top < arrayPostion.top || arrayRectangle.bottom > arrayPostion.bottom || arrayRectangle.right>  arrayPostion.right ||arrayRectangle.left < arrayPostion.left){
    		bool = false;
    		$( "#infos" ).text(bool + "top : "+arrayRectangle.top+" "+arrayPostion.top + " / "
    			+ "bottom : "+arrayRectangle.bottom+" "+arrayPostion.bottom + " / "
    			+ "right : "+arrayRectangle.right+" "+arrayPostion.right + " / "
    			+ "left : "+arrayRectangle.left+" "+arrayPostion.left + " / "

    			);
    	}else{
    		bool = true;
    		$( "#infos" ).text(bool);
    	}
    	
    	return bool; 

    },

    buildHtml : function( imageUrl ,containerSize, cropSizes){


        //building the divs for the crop;
        var widthSides = (containerSize.w - cropSizes.w) / 2;
        var heightSides = cropSizes.h;
        var heightTop = containerSize.h /4;

        var topPostionBottom = heightSides + heightTop;
        var bottomHeight = containerSize.h - topPostionBottom;
        var marginRightSide = widthSides + cropSizes.w;
        
        //load image
        $("#image").attr("src",imageUrl).css("width",containerSize.w)
        //build the main container
        $("#content").css("width",containerSize.w).css("height",containerSize.h);
        $("#contentOverlay").css("width",containerSize.w).css("height",containerSize.h);

        $("#overlayTop").css("height",heightTop).css("width",containerSize.w).css("top",0);
        $("#overlayLeft").css("height",heightSides).css("width",widthSides).css("top",heightTop);
        $("#overlayRight").css("height",heightSides).css("width",widthSides).css("margin-left",marginRightSide).css("top",heightTop);
        $("#overlayBottom").css("height",bottomHeight).css("width",containerSize.w).css("top",topPostionBottom);

        var imageSize = this.getImageSize();
        var minScale = cropSizes.w / containerSize.w ;
        console.log(cropSizes.w,containerSize.w );

        appValues.positionCrop = {
            'left': widthSides,
            'top' : heightTop, 
            'right' : widthSides + cropSizes.w, 
            'bottom' : heightTop + cropSizes.h,
            'minScale' : minScale
        }
    },

    sendDataToPhp : function(){
        return getAllData();
    }












};