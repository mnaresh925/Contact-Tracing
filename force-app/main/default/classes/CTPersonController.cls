public with sharing class CTPersonController {

    //Generate a token based on MD5 Algothim and mobilenumber
    public static String getToken(String mobileNumber){
        Blob targetBlob = Blob.valueOf('MobileNumber');
        Blob hash = Crypto.generateDigest('MD5', targetBlob);
        return EncodingUtil.convertToHex(hash);
    }
}
