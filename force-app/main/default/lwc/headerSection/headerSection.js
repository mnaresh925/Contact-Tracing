import { LightningElement, api, track, wire } from 'lwc';
import getHealthStatusCount from '@salesforce/apex/CTHealthTabController.getHealthStatusCount';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import CTRefreshPage from '@salesforce/messageChannel/CTRefreshPage__c';

export default class HeaderSection extends LightningElement {
    @api
    headerTitle;
    @track
    healthStatus = [];

    subscription = null;

    @wire(MessageContext)
    messageContext;


    @api
    getHealthStatus(title) {
        this.healthStatus = [];
        getHealthStatusCount({ statusType: title }).then(response => {
            this.prepareData(response);
        }).catch(error => console.log("Error in fetching Person Health Status Count" + error));
    }

    prepareData(data) {
        for (let key in data) {
            this.healthStatus.push({
                'key': key,
                'value': data[key],
                'class': `header-item ${key}`
            });
        }
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                CTRefreshPage,
                () => this.handleMessage()
            );
        }
    }

    handleMessage() {
        this.getHealthStatus(this.headerTitle);
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