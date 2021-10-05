import { LightningElement } from 'lwc';

export default class HealthAdminTab extends LightningElement {
    headerTitle;

    handleActive(event) {
        this.headerTitle = event.target.value;
        const selectedViewEvent = new CustomEvent("selectedView", { detail: this.headerTitle });
        this.dispatchEvent(selectedViewEvent);
    }
}