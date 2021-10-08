import { LightningElement, api, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Location__c.Name';
import STATUS_FIELD from '@salesforce/schema/Location__c.Status__c';
import RED_SCORE_FIELD from '@salesforce/schema/Location__c.Red_Score__c';
import PIN_FIELD from '@salesforce/schema/Location__c.Pincode__c';
import ADDRESS_FIELD from '@salesforce/schema/Location__c.Address__c';
import STATUS_UPDATE_DATE_FIELD from '@salesforce/schema/Location__c.Status_Update_Date__c';

import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ViewLocationRecord from '@salesforce/messageChannel/ViewLocationRecord__c';


export default class CTLocationView extends LightningElement {
    @api recordId;
    @api objectApiName = 'Location__c';
    fields = [NAME_FIELD, STATUS_FIELD, RED_SCORE_FIELD, PIN_FIELD, ADDRESS_FIELD, STATUS_UPDATE_DATE_FIELD];

    subscription = null;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                ViewLocationRecord,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        this.recordId = message.recordId;
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading location',
                message: reduceErrors(error).join(', '),
                variant: 'error'
            })
        );
    }

}