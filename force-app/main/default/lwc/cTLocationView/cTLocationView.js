import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Location__c.Name';
import STATUS_FIELD from '@salesforce/schema/Location__c.Status__c';
import RED_SCORE_FIELD from '@salesforce/schema/Location__c.Red_Score__c';
import PIN_FIELD from '@salesforce/schema/Location__c.Pincode__c';
import ADDRESS_FIELD from '@salesforce/schema/Location__c.Address__c';
import STATUS_UPDATE_DATE_FIELD from '@salesforce/schema/Location__c.Status_Update_Date__c';

export default class CTLocationView extends LightningElement {
    @api recordId = 'a065g00000C3zvcAAB';
    @api objectApiName = 'Location__c';
    fields = [NAME_FIELD, STATUS_FIELD, RED_SCORE_FIELD, PIN_FIELD, ADDRESS_FIELD, STATUS_UPDATE_DATE_FIELD];

}