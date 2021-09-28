public with sharing class CTLocationTriggerHandler {
    public static void beforeInsert(List<Location__c> newLocationRecords){
        for(Location__c lc:newLocationRecords){
            lc.Status__c = 'Green';
        }
    }
    public static void beforeUpdate(List<Location__c> newLocationRecords,Map<Id,Location__c> oldLocationMap){
        for(Location__c lc:newLocationRecords){
            if(lc.Status__c != oldLocationMap.get(lc.Id).Status__c){
                lc.Status_Update_Date__c = Date.today();
            }
        }
    }
    public static void afterUpdate(List<Location__c> newLocationRecords,Map<Id,Location__c> oldLocationMap){
        set<id> redStatusLocations = new set<id>();
        for(Location__c lc:newLocationRecords){
            if(lc.Status__C == 'Red' && lc.Status__c != oldLocationMap.get(lc.Id).Status__c){
                redStatusLocations.add(lc.id);
            }
        }
        List<Location_Tracing__c> vistedLocations = CTLocationTractingController.getLocationsByLocationIds(redStatusLocations);
        List<Person__c> personToUpdate = new List<Person__c>();
        set<id> personToUpdateIds = new set<id>();
        for(Location_Tracing__c lc : vistedLocations){
            personToUpdateIds.add(lc.Person__c);
        }

        for(id p:personToUpdateIds){
            personToUpdate.add(new Person__c(Id=p,Health_Status__c='Yellow'));
        }

        if(personToUpdate !=null && personToUpdate.size() >0 ){
            update personToUpdate;
        }
    }
}
