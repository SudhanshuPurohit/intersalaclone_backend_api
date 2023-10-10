const imagekit = require("imagekit");

exports.initImagekit = function(){
    return new imagekit({
        publicKey: process.env.imagekitpublickey,
        privateKey: process.env.imagekitprivatekey,
        urlEndpoint: process.env.urlendpointimagekit,

    });
}