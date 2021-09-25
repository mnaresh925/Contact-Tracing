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
}
