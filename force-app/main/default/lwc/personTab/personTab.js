import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPersonDetails from '@salesforce/apex/CTPersonTabController.getPersonDetails';
columns = [
    { label: 'Token', fieldName: 'token', type: 'text' },
    { label: 'Contact Status', fieldName: 'status', type: 'text' },
    { label: 'Contact Date', fieldName: 'contactDate', type: 'date' }
]

export default class PersonTab extends LightningElement {

    userInfo;

    getUserInfo(recordId) {
        getPersonDetails({ recordId: recordId }).then(results => {
            if (results && results.name) {
                this.userInfo = results;
                console.log(this.userInfo);
            } else {
                this.showToast("ERROR", "Please enter valid User id", "error");
            }
        }).catch(error => console.log("error in fetching results" + error));
    }


    handleSearch(event) {
        this.userInfo = null;
        const recordId = event.detail;
        if (recordId) {
            this.getUserInfo(recordId);
        } else {
            this.showToast("ERROR", "Please enter valid User id", "error");
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