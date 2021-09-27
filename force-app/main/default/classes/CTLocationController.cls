public with sharing class CTLocationController {
     /**
     * return first 100 Location records sorted by status updated date in desc order
     */
    public static List<Location__c> getRecentStatusChanges() {
        return [SELECT Id, Name, City__c, Country__c, Land_Mark__c, 
                        Postal_Code__c, State__c, Street__c, Verified__c,
                        Address__c, Pincode__c, Red_Score__c, Status_Update_Date__c,
                        Status__c
                        FROM Location__c
                        WITH SECURITY_ENFORCED
                        Order By Status_Update_Date__c Desc 
                        Limit 100];
    }
    /**
     * return Location records that matches the searchteam(Name,pincode or address)
     * sorted by status updated date in desc order
     */
    public static List<Location__c> searchLocations(String searchTerm){
        searchTerm = searchTerm + '%';
        return [SELECT Id, Name, City__c, Country__c, Land_Mark__c, 
                       Postal_Code__c, State__c, Street__c, Verified__c,
                       Address__c, Pincode__c, Red_Score__c, Status_Update_Date__c,
                       Status__c
                       FROM Location__c
                       WHERE Name Like :searchTerm OR
                             Pincode__c Like :searchTerm OR
                             Address__c Like :searchTerm
                       WITH SECURITY_ENFORCED 
                       Order By Status_Update_Date__c Desc];
    }
    /**
     * return Location record that matches the person id
     */
    public static Location__c getLocationById(String locationId){
        List<Location__c> locations = new List<Location__c>();        
        locations =  [SELECT Id, Name, City__c, Country__c, Land_Mark__c, 
                             Postal_Code__c, State__c, Street__c, Verified__c,
                             Address__c, Pincode__c, Red_Score__c, Status_Update_Date__c,
                             Status__c 
                        FROM Location__c 
                        Where Id=:locationId 
                        WITH SECURITY_ENFORCED];
        if(locations != null && locations.size() > 0){
            return locations[0];
        }else{
            return null;
        }
    }

    public static Map<String,Integer> getStatusCount(){
        Map<String,Integer> numberOfLocation = new Map<String,Integer>();
        for(AggregateResult ar:[SELECT Status__c ,count(id) statusCount FROM Location__c with SECURITY_ENFORCED group by Status__c ]){
            numberOfLocation.put((String.valueOf(ar.get('Status__c'))),(Integer)ar.get('statusCount'));
        }
        return numberOfLocation;
    }

    public static void updateRedScore(Set<Id> locationIds){
        List<Location__c> locationToUpdate = new List<Location__c>();
        AggregateResult[] redPeoplePerLocation = [SELECT Location__c, COUNT(Id) total FROM Location_Tracing__c
                WHERE Person__r.Health_Status__c = 'Red'
                AND Visit_Date__c = LAST_N_DAYS :10
                AND Location__c IN : locationIds
                WITH SECURITY_ENFORCED
                GROUP BY Location__c];

                for (AggregateResult ar : redPeoplePerLocation) {
                    String locationId = String.valueOf(ar.get('Location__c'));
                    Integer redScore = Integer.valueOf(ar.get('total'));
                    String status = getStatus(redScore);
                    locationToUpdate.add(new Location__c(Id=locationId, Red_Score__c=redScore, Status__c=status));
                }

                if(locationToUpdate != null && locationToUpdate.size() > 0){
                    update locationToUpdate;
                }
    }

    public static String getStatus(Integer redScore){
        if(redScore == 0){
            return 'Green';
        } else if(redScore <= 5){
            return 'Yellow';
        } else if(redScore <= 10){
            return 'Orange';
        } else{
            return 'Red';
        }
    }
}