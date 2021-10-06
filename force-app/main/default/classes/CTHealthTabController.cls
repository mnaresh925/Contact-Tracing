public with sharing class CTHealthTabController {
   @AuraEnabled
   public static Map<String,Integer> getHealthStatusCount(String statusType){
       return statusType == 'Person View' ? CTPersonController.getHealthStatusCount() : CTLocationController.getStatusCount();
   }   
}
