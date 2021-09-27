public with sharing class CTPersonTriggerController {
    public static void beforeInsert(List<Person__c> newPersonList){
        for(Person__c p:newPersonList){
            p.Health_Status__c = 'Green';
            p.Token__c = CTPersonController.getToken(p.Mobile__c);
        }
    }

    public static void beforeUpdate(List<Person__c> newPersonList,Map<Id,Person__c> oldPersonMap){
        for(Person__c p:newPersonList){
            if(p.Health_Status__c != oldPersonMap.get(p.Id).Health_Status__c){
                p.Status_Update_Date__c = Date.today();
            }
        }
    }

    public static void afterUpdate(List<Person__c> newPersonList,Map<Id,Person__c> oldPersonMap){
        set<Id> statusUpdate = new set<Id>();
        set<Id> redStatus = new set<Id>();
        for(Person__c p:newPersonList){
            if(p.Health_Status__c != oldPersonMap.get(p.Id).Health_Status__c){
                statusUpdate.add(p.Id);
            }
            if(p.Health_Status__c == 'Red' && p.Health_Status__c != oldPersonMap.get(p.Id).Health_Status__c){
                redStatus.add(p.Id);
            }
            set<id> orangeStatus = new set<id>();
            set<id> yellowStatus = new set<id>();
            set<id> processedIds = new set<Id>();
            processedIds.addAll(redStatus);
            orangeStatus.addall(CTPersonController.getCohabitants(redStatus,processedIds));
            set<Id> primaryContactIds = CTPersonController.getPrimaryContacts(redStatus, processedIds);
            orangeStatus.addAll(primaryContactIds);
            yellowStatus.addall(CTPersonController.getNeighbours(redStatus, processedIds));            
            yellowStatus.addAll(CTPersonController.getSecondaryContacts(primaryContactIds, processedIds));
            List<Person__c> personToUpdate =new List<Person__c>();
            for(Id pId:orangeStatus){
                personToUpdate.add(new Person__c(Id=pId,Health_Status__c='Orange'));
            }
            for(Id pId:yellowStatus){
                personToUpdate.add(new Person__c(Id=pId,Health_Status__c='Yellow'));
            }
            if(personToUpdate.size()>0){
                update personToUpdate;
            }

        List<Location_Tracing__c> locationTraces = CTLocationTractingController.getLocationsByPersonIds(statusUpdate);
        if(locationTraces != null && locationTraces.size() > 0){
            Set<Id> locationIds = new Set<Id>();
            for (Location_Tracing__c trace : locationTraces) {
                locationIds.add(trace.Location__c);
            }
            CTLocationController.updateRedScore(locationIds);
        }
            
        }

    }
}
