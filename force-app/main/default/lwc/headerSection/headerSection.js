import { LightningElement, api, track } from 'lwc';
import getHealthStatusCount from '@salesforce/apex/CTHealthTabController.getHealthStatusCount';

export default class HeaderSection extends LightningElement {
    @api
    headerTitle;
    @track
    healthStatus = [];

    @api
    getHealthStatus(title) {
        this.healthStatus = [];
        getHealthStatusCount({ statusType: title }).then(response => {
            this.prepareData(response);
        }).catch(error => console.log("Error in fetching Person Health Status Count" + error));
    }

    prepareData(data) {
        for (let key in data) {
            this.healthStatus.push({
                'key': key,
                'value': data[key],
                'class': `header-item ${key}`
            });
        }
    }

}