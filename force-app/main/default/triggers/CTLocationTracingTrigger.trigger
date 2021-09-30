trigger CTLocationTracingTrigger on Location_Tracing__c (before insert,after insert) {
    switch on Trigger.operationType {
        when BEFORE_INSERT {
            CTLocationTracingTriggerHandler.beforeInsert(Trigger.new);
        }
        when else {
            
        }
    }

}