import { LightningElement, track } from 'lwc';
import getLocationInformation from '@salesforce/apex/CTLocationTabController.getLocationInformation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
const columns = [
    { label: 'Token', fieldName: 'token', type: 'text' },
    { label: 'Contact Status', fieldName: 'status', type: 'text' },
    { label: 'Visit Date', fieldName: 'visitDate', type: 'date' }
];
export default class LocationTab extends LightningElement {

    @track
    locationinfo;
    columns = columns;
    @track
    headerInfo;
    @track
    subheaderInfo;
    @track
    body;

    fetchLocationInformation(recordId) {
        getLocationInformation({ recordId: recordId }).then(result => {
            if (result && result.name) {
                this.locationinfo = result;
                this.prepareCardData();
            } else {
                this.showToast("ERROR", "Please enter valid location id", "error");
            }
        }).catch(error => console.log("error in fetching location info" + error));
    }

    handleSearch(event) {
        this.locationinfo = null;
        const recordIdValue = event.detail;
        if (recordIdValue) {
            this.fetchLocationInformation(recordIdValue);
        } else {
            this.showToast("ERROR", "Please enter valid location id", "error");
        }

    }

    headerClass() {
        return this.locationinfo?.status ? this.locationinfo.status + ' health-header' : 'health-header';
    }

    prepareCardData() {
        const locationinfo = this.locationinfo;
        this.headerInfo = {
            "class": this.headerClass(),
            "text": `${locationinfo.name} , your health status is ${locationinfo.status}`
        };
        this.subheaderInfo = [
            {
                'label': 'Red Score',
                'value': locationinfo.redScore
            },
            {
                'label': 'Contacts in Last 30 days',
                'value': locationinfo.contactsCount
            }
        ];
        this.body = {
            'header': 'Recent Visitors',
            'columns': this.columns,
            'data': locationinfo.contacts
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}