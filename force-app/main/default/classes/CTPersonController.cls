public with sharing class CTPersonController {

    //Generate a token based on MD5 Algothim and mobilenumber
    public static String getToken(String mobileNumber){
        Blob targetBlob = Blob.valueOf(mobileNumber);
        Blob hash = Crypto.generateDigest('MD5', targetBlob);
        return EncodingUtil.base64Encode(hash);
    }
    /**
     * return first 100 person records sorted by status updated date in desc order
     */
    public static List<Person__c> getRecentHealthChanges() {
        return [SELECT Id, Name, Health_Status__c, Mobile__c, Status_Update_Date__c, Token__c 
                FROM Person__c 
                WITH SECURITY_ENFORCED 
                Order By Status_Update_Date__c Desc 
                Limit 100];
    }

    /**
     * return person records that matches the searchteam(Name,Mobile or Token)
     * sorted by status updated date in desc order
     */
    public static List<Person__c> searchPeople(String searchTerm){
        searchTerm = searchTerm + '%';
        return [SELECT Id, Name, Health_Status__c, Mobile__c, Status_Update_Date__c, Token__c 
                FROM Person__c 
                where Name Like :searchTerm OR 
                      Mobile__c Like :searchTerm OR 
                      Token__c Like:searchTerm 
                WITH SECURITY_ENFORCED 
                Order By Status_Update_Date__c Desc];
    }
    /**
     * return person record that matches the person id
     */
    public static Person__c getPersonById(String personId){
        List<Person__c> people = new List<Person__c>();        
        people =  [SELECT Id, Name, Health_Status__c, Mobile__c, Status_Update_Date__c, Token__c 
                FROM Person__c 
                Where Id=:personId 
                WITH SECURITY_ENFORCED];
        if(people != null && people.size() > 0){
            return people[0];
        }else{
            return null;
        }

    }

    public static Map<String,Integer> getHealthStatusCount(){
        Map<String,Integer> healthStatusCount = new Map<String,Integer>(); 
        for(AggregateResult healthstatus:[SELECT Health_Status__c, Count(Id) statusCount FROM Person__c WITH SECURITY_ENFORCED GROUP BY Health_Status__c]){
            healthStatusCount.put((string)healthstatus.get('Health_Status__c'), (Integer)healthstatus.get('statusCount'));
        }    
        return healthStatusCount;
    }

    public static set<Id> getCohabitants(set<Id> people,set<Id> alreadyProcessed){
        List<String> healthStatus = new List<String>{'Red','Orange'};
        List<People_Tracing__c> cohabitantsList =[SELECT Id, Name, Person_1__c, Person_2__c 
                                                  FROM People_Tracing__c where 
                                                 (Person_1__c IN : people OR Person_2__c IN : people) AND 
                                                 (Person_1__r.Health_Status__c NOT IN : healthStatus OR Person_2__r.Health_Status__c NOT IN :healthStatus) AND
                                                  Contact_Type__c = 'Cohabitant'
                                                  WITH SECURITY_ENFORCED
                                                ];
        set<Id> cohabitants = new set<Id>();
        for(People_Tracing__c pt: cohabitantsList){
            if(people.contains(pt.Person_1__c) && !alreadyProcessed.contains(pt.Person_2__c)){
                cohabitants.add(pt.Person_2__c);
                alreadyProcessed.add(pt.Person_2__c);
            }
            if(people.contains(pt.Person_2__c) && !alreadyProcessed.contains(pt.Person_1__c)){
                cohabitants.add(pt.Person_1__c);
                alreadyProcessed.add(pt.Person_1__c);
            }
        }
        return cohabitants;
    }

    public static set<Id> getPrimaryContacts(set<Id> people,set<Id> alreadyProcessed){
        List<String> healthStatus = new List<String>{'Red','Orange'};
        List<People_Tracing__c> primaryContactList =[SELECT Id, Name, Person_1__c, Person_2__c 
                                                  FROM People_Tracing__c where 
                                                 (Person_1__c IN : people OR Person_2__c IN : people) AND 
                                                 (Person_1__r.Health_Status__c NOT IN : healthStatus OR Person_2__r.Health_Status__c NOT IN :healthStatus) AND
                                                  Contact_Type__c = 'Other'
                                                  WITH SECURITY_ENFORCED
                                                ];
        set<Id> primaryContacts = new set<Id>();
        for(People_Tracing__c pt: primaryContactList){
            if(people.contains(pt.Person_1__c) && !alreadyProcessed.contains(pt.Person_2__c)){
                primaryContacts.add(pt.Person_2__c);
                alreadyProcessed.add(pt.Person_2__c);
            }
            if(people.contains(pt.Person_2__c) && !alreadyProcessed.contains(pt.Person_1__c)){
                primaryContacts.add(pt.Person_1__c);
                alreadyProcessed.add(pt.Person_1__c);
            }
        }
        return primaryContacts;
    }

    public static set<Id> getNeighbours(set<Id> people,set<Id> alreadyProcessed){
        List<String> healthStatus = new List<String>{'Red','Orange','Yellow'};
        List<People_Tracing__c> neighbourList =[SELECT Id, Name, Person_1__c, Person_2__c 
                                                  FROM People_Tracing__c where 
                                                 (Person_1__c IN : people OR Person_2__c IN : people) AND 
                                                 (Person_1__r.Health_Status__c NOT IN : healthStatus OR Person_2__r.Health_Status__c NOT IN :healthStatus) AND
                                                  Contact_Type__c = 'Neighbour'
                                                  WITH SECURITY_ENFORCED
                                                ];
        set<Id> neighbours = new set<Id>();
        for(People_Tracing__c pt: neighbourList){
            if(people.contains(pt.Person_1__c) && !alreadyProcessed.contains(pt.Person_2__c)){
                neighbours.add(pt.Person_2__c);
                alreadyProcessed.add(pt.Person_2__c);
            }
            if(people.contains(pt.Person_2__c) && !alreadyProcessed.contains(pt.Person_1__c)){
                neighbours.add(pt.Person_1__c);
                alreadyProcessed.add(pt.Person_1__c);
            }
        }
        return neighbours;
    }

    public static set<Id> getSecondaryContacts(set<Id> people,set<Id> alreadyProcessed){
        List<String> healthStatus = new List<String>{'Red','Orange'};
        List<People_Tracing__c> secondaryContactList =[SELECT Id, Name, Person_1__c, Person_2__c 
                                                  FROM People_Tracing__c where 
                                                 (Person_1__c IN : people OR Person_2__c IN : people) AND 
                                                 (Person_1__r.Health_Status__c NOT IN : healthStatus OR Person_2__r.Health_Status__c NOT IN :healthStatus) AND
                                                  Contact_Type__c = 'Other'
                                                  WITH SECURITY_ENFORCED
                                                ];
        set<Id> secondaryContacts = new set<Id>();
        for(People_Tracing__c pt: secondaryContactList){
            if(people.contains(pt.Person_1__c) && !alreadyProcessed.contains(pt.Person_2__c)){
                secondaryContacts.add(pt.Person_2__c);
                alreadyProcessed.add(pt.Person_2__c);
            }
            if(people.contains(pt.Person_2__c) && !alreadyProcessed.contains(pt.Person_1__c)){
                secondaryContacts.add(pt.Person_1__c);
                alreadyProcessed.add(pt.Person_1__c);
            }
        }
        return secondaryContacts;
    }

}