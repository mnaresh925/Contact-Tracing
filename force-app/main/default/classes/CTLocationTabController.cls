public with sharing class CTLocationTabController {

  @AuraEnabled
  public static LocationInformation getLocationInformation(String recordId){
    LocationInformation locinf = new LocationInformation();
    
    Location__c locationRecord = CTLocationController.getLocationById(recordId);
    if(locationRecord != null){
        locinf.name = locationRecord.Name;
        locinf.redScore = Integer.valueOf(locationRecord.Red_Score__c);
        locinf.statusUpdatedOn = locationRecord.Status_Update_Date__c;
        locinf.status = locationRecord.Status__c;
    }
   
    List<Location_Tracing__c> traces = CTLocationTractingController.getVisitors(recordId);

    if (traces != null && traces.size() > 0) {
        List<CloseContacts> closeContacts = new List<CloseContacts>();

        for (Location_Tracing__c trace : traces) {
            CloseContacts cc = new CloseContacts();
            cc.id = trace.Person__c;
            cc.status = trace.Person__r.Health_Status__c;
            cc.token = trace.Person__r.Token__c;
            cc.visitDate = trace.Visit_Date__c;
            closeContacts.add(cc);
        }

        locinf.contacts = closeContacts;
        locinf.contactsCount = closeContacts.size();
    }

    return locinf;
  }

   public class LocationInformation{
       @AuraEnabled
       public String name;
       @AuraEnabled
       public Integer redScore;
       @AuraEnabled
       public Date statusUpdatedOn;
       @AuraEnabled
       public String status;
       @AuraEnabled
       public Integer contactsCount = 0;
       @AuraEnabled
       public List<CloseContacts> contacts;
   }
   public class CloseContacts{
       @AuraEnabled
       public String id;
       @AuraEnabled
       public String token;
       @AuraEnabled
       public Date visitDate;
       @AuraEnabled
       public String status;
   }
}
