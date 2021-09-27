trigger CTPersonTrigger on Person__c (before insert,after insert,before update,after update,before delete,after delete,after undelete) {
  switch on Trigger.operationType {
      when BEFORE_INSERT {
        CTPersonTriggerController.beforeInsert(Trigger.new);
      }
      when BEFORE_UPDATE {
        CTPersonTriggerController.beforeUpdate(Trigger.new, Trigger.oldMap);
      }
      when AFTER_UPDATE{
        CTPersonTriggerController.afterUpdate(Trigger.new,Trigger.oldMap);
      }
  }
}