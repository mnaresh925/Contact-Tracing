trigger CTLocationTrigger on Location__c (before insert,before update,after insert,after update, before delete,after delete,after undelete) {
   switch on Trigger.operationType {
       when BEFORE_INSERT {
           CTLocationTriggerHandler.beforeInsert(Trigger.new);
       }
       when BEFORE_UPDATE {
           CTLocationTriggerHandler.beforeUpdate(Trigger.new, Trigger.oldMap);
       }
   }
}