var appValues = {
    "initCrop" : {
        'left': 0,
        'top' : 0, 
        'right' : 0 ,
        'bottom' : 0,
        'minScale' : 0 ,
        'width' :0,
        'height':0
    }, 
    "scale":1,
    "ImagePositionAfterScale" : 0,
    "ImagePosition" : {
        "width" :0,
        "height" :0,
        "top" : 0,
        "left" : 0
    },
    "cropPosition" : {
        "top" : 0,
        "left" : 0
    }
}

var mainScript = {

     // first method to call   
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

        appValues.initCrop = {
            'left': widthSides,
            'top' : heightTop, 
            'right' : widthSides + cropSizes.w, 
            'bottom' : heightTop + cropSizes.h,
            'minScale' : minScale,
            'width' :cropSizes.w,
            'height' : cropSizes.h
        }
    },

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
            'right' : positionRight -4, 
            'bottom' : positionBottom -4
        }

        appValues.ImagePositionAfterScale =  $("#image").position();
        
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
        var originalImagePosition = this.getImagePosition();

        appValues.cropPosition.top =  appValues.initCrop.top - (appValues.ImagePositionAfterScale.top + originalImagePosition.top);
        appValues.cropPosition.left = appValues.initCrop.left - (appValues.ImagePositionAfterScale.left + originalImagePosition.left);
        
        appValues.ImagePosition.width = (originalImagePosition.right - originalImagePosition.left) * appValues.scale;
        appValues.ImagePosition.height = (originalImagePosition.bottom - originalImagePosition.top) * appValues.scale;

        appValues.ImagePosition.top = originalImagePosition.top + appValues.ImagePositionAfterScale.top;
        appValues.ImagePosition.left = originalImagePosition.left + appValues.ImagePositionAfterScale.left;
      
        returnedArray = {
            "crop" : appValues.cropPosition,
            "image" : appValues.ImagePosition
        };

        console.log(appValues, originalImagePosition.top, appValues.ImagePositionAfterScale.top, appValues.initCrop.top);

        $( "#infos" ).text( "image top : "+ appValues.cropPosition.top +" / image left : "+appValues.cropPosition.left +" / width : "+appValues.ImagePosition.width+" / height : "+appValues.ImagePosition.height );
        return returnedArray;
    },

    getRectanglePosition : function(){
        return appValues.initCrop;
    },

    isPhotoInRectangle: function() {
        this.getAllData();
        var arrayRectangle = this.getRectanglePosition();

        var imageRight = appValues.ImagePosition.width + appValues.ImagePosition.left;
        var imageBottom = appValues.ImagePosition.height + appValues.ImagePosition.top;
        //var bool = false;

        
        if( appValues.initCrop.top < appValues.ImagePosition.top || 
            appValues.initCrop.bottom > imageBottom || 
            appValues.initCrop.right>  imageRight ||
            appValues.initCrop.left < appValues.ImagePosition.left){

            bool = false;

        }else{
            bool = true;
            
        }
        

        // if (appValues.cropPosition.top + appValues.initCrop.height < imageBottom
        //     && appValues.cropPosition.left + appValues.initCrop.width < imageRight) {
        //     bool = true;
        // } else {
        //     bool = false;
        // }

        $( "#infos" ).text(bool);
            console.log("top",appValues.ImagePosition.top );
            console.log("bottom", imageBottom );
            console.log("right",imageRight );
            console.log("left",appValues.ImagePosition.left );
        return bool; 

    },

    sendDataToPhp : function(){
        return this.getAllData();
    }





};

