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
}
