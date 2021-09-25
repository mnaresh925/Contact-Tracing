public with sharing class CTLocationTractingController {
    /**
     * returns the location tracting records that matches locationid
     */
    public static List<Location_Tracing__c> getVisitors(string locationId){
        return [SELECT Id, Name, Person__c, Location__c, Visit_Date__c ,Person__r.Token__c, Person__r.Health_Status__c
                FROM Location_Tracing__c 
                Where Location__c =:locationId
                WITH SECURITY_ENFORCED
                Order by Visit_Date__c Desc];
    }
    /**
     * return Location Tracting records that matches 
     * PersonIds and last 10 visit days
     */
    public static List<Location_Tracing__c> getLocationsByPersonIds(Set<Id> personIds){
        return [SELECT Id, Name, Person__c, Location__c, Visit_Date__c 
                FROM Location_Tracing__c 
                Where Person__c =:personIds AND
                Visit_Date__c = LAST_N_DAYS:10
                WITH SECURITY_ENFORCED
                Order by Visit_Date__c Desc];
    }
    /**
     * return location tracting records that matches locationsIds 
     * and person health status is green
     */
    
    public static List<Location_Tracing__c> getLocationsByLocationIds(Set<Id> locationIds){
        return [SELECT Id, Name, Person__c, Location__c, Visit_Date__c 
                FROM Location_Tracing__c 
                Where Location__c =:locationIds AND
                Visit_Date__c = LAST_N_DAYS:10 AND
                Person__r.Health_Status__c = 'Green'
                WITH SECURITY_ENFORCED
                Order by Visit_Date__c Desc
               ];
    }
}
