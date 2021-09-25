public with sharing class CTPersonController {

    //Generate a token based on MD5 Algothim and mobilenumber
    public static String getToken(String mobileNumber){
        Blob targetBlob = Blob.valueOf(mobileNumber);
        Blob hash = Crypto.generateDigest('MD5', targetBlob);
        return EncodingUtil.base64Encode(hash);
    }
    /**
     * return first 100 person records sorted by status updated date in desc order
     */
    public static List<Person__c> getRecentHealthChanges() {
        return [SELECT Id, Name, Health_Status__c, Mobile__c, Status_Update_Date__c, Token__c 
                FROM Person__c 
                WITH SECURITY_ENFORCED 
                Order By Status_Update_Date__c Desc 
                Limit 100];
    }

    /**
     * return person records that matches the searchteam(Name,Mobile or Token)
     * sorted by status updated date in desc order
     */
    public static List<Person__c> searchPeople(String searchTerm){
        searchTerm = searchTerm + '%';
        return [SELECT Id, Name, Health_Status__c, Mobile__c, Status_Update_Date__c, Token__c 
                FROM Person__c 
                where Name Like :searchTerm OR 
                      Mobile__c Like :searchTerm OR 
                      Token__c Like:searchTerm 
                WITH SECURITY_ENFORCED 
                Order By Status_Update_Date__c Desc];
    }
    /**
     * return person record that matches the person id
     */
    public static Person__c getPersonById(String personId){
        List<Person__c> people = new List<Person__c>();        
        people =  [SELECT Id, Name, Health_Status__c, Mobile__c, Status_Update_Date__c, Token__c 
                FROM Person__c 
                Where Id=:personId 
                WITH SECURITY_ENFORCED];
        if(people != null && people.size() > 0){
            return people[0];
        }else{
            return null;
        }

    }

}
