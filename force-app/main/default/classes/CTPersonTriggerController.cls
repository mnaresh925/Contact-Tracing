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
}
