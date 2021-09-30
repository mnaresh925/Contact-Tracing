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
                Where Person__c IN:personIds AND
                Visit_Date__c = LAST_N_DAYS:10
                WITH SECURITY_ENFORCED
                Order by Visit_Date__c Desc];
    }
    /**
* return location tracing records that matches locationsIds 
* and person health status is green
*/
    
    public static List<Location_Tracing__c> getLocationsByLocationIds(Set<Id> locationIds){
        return [SELECT Id, Name, Person__c, Location__c, Visit_Date__c 
                FROM Location_Tracing__c 
                Where Location__c IN:locationIds AND
                Visit_Date__c = LAST_N_DAYS:10 AND
                Person__r.Health_Status__c = 'Green'
                WITH SECURITY_ENFORCED
                Order by Visit_Date__c Desc
               ];
    }
    
    /**
* return the duplicate Location tracking records
*/
    public static List<Location_Tracing__c> checkDuplicates(List<Location_Tracing__c> locationTraces){
        Set<Id> locationids = new Set<Id>();
        Set<Id> personids = new Set<Id>();
        List<Location_Tracing__c> duplicateTraces = new List<Location_Tracing__c>();
        List<Location_Tracing__c> exisitingTraces = new List<Location_Tracing__c>();
        Map<ID, Set<Id>> locationMap = new Map<ID, Set<Id>>();
        for(Location_Tracing__c trace:locationTraces){
            locationids.add(trace.Location__c);
            personids.add(trace.Person__c);   
            
        }
        if(locationids.size() > 0 || personids.size() > 0){
            exisitingTraces = [SELECT Id, Name, Person__c, Location__c, Visit_Date__c 
                               FROM Location_Tracing__c 
                               Where Location__c IN :locationids AND
                               Person__c  IN :personids
                               WITH SECURITY_ENFORCED];
        }
        
        for(Location_Tracing__c trace:exisitingTraces){
            if(!locationMap.containsKey(trace.Location__c)){
                locationMap.put(trace.Location__c, new Set<Id>());
            }
            locationMap.get(trace.Location__c).add(trace.person__c);          
            
        }        
        
        if(exisitingTraces !=null && exisitingTraces.size() > 0){
            for(Location_Tracing__c eTrace:locationTraces){
                if(locationMap.containsKey(eTrace.Location__c) &&
                   locationMap.get(etrace.Location__c).contains(eTrace.Person__c)){
                       duplicateTraces.add(eTrace);
                   }
            }        
        }
        return duplicateTraces;
    }
    
}