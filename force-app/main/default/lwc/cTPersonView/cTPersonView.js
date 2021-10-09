import { LightningElement, api, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Person__c.Name';
import MOBILE_FIELD from '@salesforce/schema/Person__c.Mobile__c';
import TOKEN_FIELD from '@salesforce/schema/Person__c.Token__c';
import HEALTH_STATUS_FIELD from '@salesforce/schema/Person__c.Health_Status__c';
import STATUS_UPDATE_DATE_FIELD from '@salesforce/schema/Person__c.Status_Update_Date__c';

import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ViewPersonRecord from '@salesforce/messageChannel/ViewPersonRecord__c';

import updateStatus from '@salesforce/apex/CTPersonViewController.updateStatus';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CTPersonView extends LightningElement {
    @api recordId;
    @api showUpdateButton = false;
    @api objectApiName = 'Person__c';
    fields = [NAME_FIELD, MOBILE_FIELD, TOKEN_FIELD, HEALTH_STATUS_FIELD, STATUS_UPDATE_DATE_FIELD];
    subscription = null;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                ViewPersonRecord,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        this.recordId = message.recordId;
        this.showUpdateButton = (message.status == 'Red') ? false : true;
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

    handleUpdate() {
        updateStatus({ recordId: this.recordId })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error);
            });
    }


}