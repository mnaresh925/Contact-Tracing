public with sharing class CTLocationTracingTriggerHandler {
    public static void beforeInsert(List<Location_Tracing__c> newLTRecords){
        List<Location_Tracing__c> duplicateRecords = CTLocationTractingController.checkDuplicates(newLTRecords);
        for(Location_Tracing__c ltc : duplicateRecords){
            ltc.addError('Tracing already registered for Location'+ltc.Location__c +' and person'+ltc.Person__c);
        }
    }
}
