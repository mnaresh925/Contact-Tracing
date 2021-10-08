import { LightningElement, api, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Person__c.Name';
import MOBILE_FIELD from '@salesforce/schema/Person__c.Mobile__c';
import TOKEN_FIELD from '@salesforce/schema/Person__c.Token__c';
import HEALTH_STATUS_FIELD from '@salesforce/schema/Person__c.Health_Status__c';
import STATUS_UPDATE_DATE_FIELD from '@salesforce/schema/Person__c.Status_Update_Date__c';

import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ViewSelectedRecord from '@salesforce/messageChannel/ViewSelectedRecord__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CTPersonView extends LightningElement {
    @api recordId;
    @api objectApiName = 'Person__c';
    fields = [NAME_FIELD, MOBILE_FIELD, TOKEN_FIELD, HEALTH_STATUS_FIELD, STATUS_UPDATE_DATE_FIELD];
    subscription = null;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                ViewSelectedRecord,
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
                title: 'Error loading person',
                message: reduceErrors(error).join(', '),
                variant: 'error'
            })
        );
    }


}