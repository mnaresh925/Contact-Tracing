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

    fetchLocationInformation(recordId) {
        getLocationInformation({ recordId: recordId }).then(result => {
            if (result && result.name) {
                this.locationinfo = result;
            } else {
                this.showToast("ERROR", "Please enter valid location id", "error");
            }
        }).catch(error => console.log("error in fetching location info" + error));
    }

    handleSearch() {
        this.locationinfo = null;
        const recordId = this.template.querySelector("lightning-input");
        const recordIdValue = recordId.value;
        if (recordIdValue) {
            this.fetchLocationInformation(recordIdValue);
        } else {
            this.showToast("ERROR", "Please enter valid location id", "error");
        }

    }

    get headerClass() {
        return this.locationinfo?.status ? this.locationinfo.status + ' health-header' : 'health-header';
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