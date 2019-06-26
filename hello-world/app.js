const request = require('request');
// const sharp = require('sharp');
const fs = require("fs");
let response;

let Buckets = {
    FULL_SIZE: 'local/max/',
    THUMBNAIL: 'local/mini/'
}


exports.lambdaHandler = async (event, context) => {
let imagen = getImageFromEvent(event);
let fullSizeImage = resizeImageToFullSize(imagen);
let thumbnailImage = resizeImageToThumbnail(imagen);
    uploadToS3(Buckets.FULL_SIZE,fullSizeImage);
    uploadToS3(Buckets.THUMBNAIL,thumbnailImage);

    

    try {
       
        response = {
            'body': ({
                message: 'Enviada'
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
    return response;
};

let getImageFromEvent = async (event) =>{
    const nameBuckets = event.Records[0].s3.bucket.name;
    const regionBuckets = event.Records[0].awsRegion;
    const keyImage = event.Records[0].s3.object.key;
    const url = `https://${nameBuckets}.s3.${regionBuckets}.amazonaws.com/${keyImage}`
    console.log(url);
    const discharged = await request(url);
    return discharged
};

function resizeImageToFullSize(image){
     // return resizeImage('fullSize',image);
   return sharp(image).resize({ width: 1025, height: 768 })
            .on('info', function(fileInfo) {
            console.log("Resizing done, file not saved");
             });


}
function resizeImageToThumbnail(image){
    // return resizeImage('thumbail',image);
    return sharp(image).resize({ width: 250, height: 250 })
            .on('info', function(fileInfo) {
            console.log("Resizing done, file not saved");
             });
}
let uploadToS3 = async (nameBuckets,img)=> {

}