import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PersonTab extends LightningElement {


    handleSearch(event) {
        const recordId = event.detail;
        if (recordId) {

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