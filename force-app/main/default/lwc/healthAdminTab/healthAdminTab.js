import { LightningElement, track } from 'lwc';
export default class HealthAdminTab extends LightningElement {
    @track headerTitle;

    /**
     * On selecting the tab, set the tab title and invoke header section method.
     * This is will rerender the Heath Status counts.
     * @param {*} event 
     */
    handleActive(event) {
        const headerTitle = event.target.value;
        this.template.querySelector('c-header-section').getHealthStatus(headerTitle);
    }
}