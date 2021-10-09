import { api, LightningElement, wire } from 'lwc';
import getRecentHealthChanges from '@salesforce/apex/CTPersonController.getRecentHealthChanges';
import getRecentStatusChanges from '@salesforce/apex/CTLocationController.getRecentStatusChanges';
import searchPeople from '@salesforce/apex/CTPersonController.searchPeople';
import searchLocations from '@salesforce/apex/CTLocationController.searchLocations';


import { publish, MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import ViewPersonRecord from '@salesforce/messageChannel/ViewPersonRecord__c';
import ViewLocationRecord from '@salesforce/messageChannel/ViewLocationRecord__c';
import CTRefreshPage from '@salesforce/messageChannel/CTRefreshPage__c';

const locationColumns = [
    { label: "Name", fieldName: "Name", type: "text" },
    { label: "Status", fieldName: "Status__c", type: "text" },
    { label: "Red Score", fieldName: "Red_Score__c", type: "number" },
    { label: "Pincode", fieldName: "Pincode__c", type: "text" },
    { label: "Address", fieldName: "Address__c", type: "text" },
    { label: "Status Update Date", fieldName: "Status_Update_Date__c", type: "date" },
    { label: "View", type: "button", initialWidth: 135, typeAttributes: { label: "View", name: "view_details", title: "Click to View Details" } }
];
const personColumns = [
    { label: "Name", fieldName: "Name", type: "text" },
    { label: "Phone", fieldName: "Mobile__c", type: "text" },
    { label: "Token", fieldName: "Token__c", type: "text" },
    { label: "Health Status", fieldName: "Health_Status__c", type: "text" },
    { label: "Status Update Date", fieldName: "Status_Update_Date__c", type: "date" },
    { label: "View", type: "button", initialWidth: 135, typeAttributes: { label: "View/Update", name: "view_details", title: "Click to View Details" } }
];

export default class CTRecentChanges extends LightningElement {
    @api
    view;
    columns;
    data = [];
    subscription = null;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.prepareData();
        this.subscribeToMessageChannel();
    }

    prepareData() {
        if (this.view == 'person') {
            this.columns = personColumns;
            getRecentHealthChanges().then(response => {
                this.data = response;
            }).catch(error => console.log("error in fetching results" + error));
        }
        if (this.view == 'location') {
            this.columns = locationColumns;
            getRecentStatusChanges().then(response => {
                this.data = response;
            }).catch(error => console.log("error in fetching results" + error));
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
        this.prepareData();
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'view_details':
                console.log('Showing Details: ' + JSON.stringify(row));
                const payLoad = {
                    'recordId': row.Id,
                    'status': (this.view == 'person') ? row.Health_Status__c : row.Status__c
                };
                const event = (this.view == 'person') ? ViewPersonRecord : ViewLocationRecord;
                publish(this.messageContext, event, payLoad);
                break;
        }
    }

    handleKeyUp(event) {
        const isEnterkey = event.keyCode === 13;
        if (isEnterkey) {
            const value = event.target.value;
            if (!value) {
                this.prepareData();
            } else {
                if (this.view == 'person') {
                    searchPeople({ searchTerm: value }).then(response => {
                        this.data = response;
                    }).catch(error => console.log("error in fetching results" + error));
                } else {
                    searchLocations({ searchTerm: value }).then(response => {
                        this.data = response;
                    }).catch(error => console.log("error in fetching results" + error));
                }
            }

        }
    }
}