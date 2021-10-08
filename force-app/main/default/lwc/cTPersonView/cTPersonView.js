import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Person__c.Name';
import MOBILE_FIELD from '@salesforce/schema/Person__c.Mobile__c';
import TOKEN_FIELD from '@salesforce/schema/Person__c.Token__c';
import HEALTH_STATUS_FIELD from '@salesforce/schema/Person__c.Health_Status__c';
import STATUS_UPDATE_DATE_FIELD from '@salesforce/schema/Person__c.Status_Update_Date__c';

export default class CTPersonView extends LightningElement {
    @api recordId = 'a0A5g00000338kTEAQ';
    @api objectApiName = 'Person__c';
    fields = [NAME_FIELD, MOBILE_FIELD, TOKEN_FIELD, HEALTH_STATUS_FIELD, STATUS_UPDATE_DATE_FIELD];
}