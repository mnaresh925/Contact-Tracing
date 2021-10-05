public with sharing class CTHealthTabController {
   @AuraEnabled
   public static Map<String,Integer> getHealthStatusCount(){
       return CTPersonController.getHealthStatusCount();
   }
}
