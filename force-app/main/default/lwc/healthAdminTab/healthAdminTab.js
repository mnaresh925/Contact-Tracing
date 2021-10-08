import { LightningElement, track } from 'lwc';

export default class HealthAdminTab extends LightningElement {
    @track headerTitle;

    handleActive(event) {
        this.headerTitle = event.target.value;
        this.template.querySelector('c-header-section').getHealthStatus(this.headerTitle);
        // const selectedViewEvent = new CustomEvent("selectedView", { detail: this.headerTitle });
        // this.dispatchEvent(selectedViewEvent);
    }
}