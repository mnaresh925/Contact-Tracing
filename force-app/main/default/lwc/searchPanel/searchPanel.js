import { LightningElement, api } from 'lwc';

export default class searchPanel extends LightningElement {
    @api
    placeholder;
    @api
    label;
    @api
    title;


    handleSearch() {
        const recordId = this.template.querySelector("lightning-input").value;
        const searchEvent = new CustomEvent('search', { detail: recordId });
        this.dispatchEvent(searchEvent);
    }
}