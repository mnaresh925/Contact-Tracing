import { LightningElement, api, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Person__c.Name';
import MOBILE_FIELD from '@salesforce/schema/Person__c.Mobile__c';
import TOKEN_FIELD from '@salesforce/schema/Person__c.Token__c';
import HEALTH_STATUS_FIELD from '@salesforce/schema/Person__c.Health_Status__c';
import STATUS_UPDATE_DATE_FIELD from '@salesforce/schema/Person__c.Status_Update_Date__c';
import ID_FIELD from '@salesforce/schema/Person__c.Id';

import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ViewPersonRecord from '@salesforce/messageChannel/ViewPersonRecord__c';

import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

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
        debugger
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[HEALTH_STATUS_FIELD.fieldApiName] = 'Red';
        const recordInput = { fields };
        updateRecord(recordInput).then(() => {
            this.showUpdateButton = false;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Person Record updated',
                variant: 'success'
            })
            );
            return refreshApex(this.Person__c);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error in Updating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

}