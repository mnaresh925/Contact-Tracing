import { api, LightningElement } from 'lwc';
import getRecentHealthChanges from '@salesforce/apex/CTPersonController.getRecentHealthChanges';
import getRecentStatusChanges from '@salesforce/apex/CTLocationController.getRecentStatusChanges'

const locationColumns = [
    { label: "Name", fieldName: "Name", type: "text" },
    { label: "Status", fieldName: "Status__c", type: "text" },
    { label: "Red Score", fieldName: "Red_Score__c", type: "number" },
    { label: "Pincode", fieldName: "Pincode__c", type: "text" },
    { label: "Address", fieldName: "Address__c", type: "text" },
    { label: "Status Update Date", fieldName: "Status_Update_Date__c", type: "date" },
    { label: "View", type: "button", initialWidth: 135, typeAttributes: { label: "View/Update", name: "view_details", title: "Click to View Details" } }
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

    connectedCallback() {
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

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'view_details':
                alert('Showing Details: ' + JSON.stringify(row));
                break;
        }
    }
}