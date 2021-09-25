public with sharing class CTPersonController {

    //Generate a token based on MD5 Algothim and mobilenumber
    public static String getToken(String mobileNumber){
        Blob targetBlob = Blob.valueOf(mobileNumber);
        Blob hash = Crypto.generateDigest('MD5', targetBlob);
        return EncodingUtil.base64Encode(hash);
    }
}
