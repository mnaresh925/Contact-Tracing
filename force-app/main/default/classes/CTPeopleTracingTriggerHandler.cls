public with sharing class CTPeopleTracingTriggerHandler {
  public static void beforeInsert(List<People_Tracing__c> newPTRecords){
      List<People_Tracing__c> duplicateRecords = CTPeopleTracingController.checkDuplicates(newPTRecords);
      for(People_Tracing__c ptr:duplicateRecords){
          ptr.addError('Record already present for Person1'+ptr.Person_1__c + 'and Person2' + ptr.Person_2__c);
      }
  }
}
