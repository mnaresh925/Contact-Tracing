import { LightningElement, api, track, wire } from 'lwc';
import getHealthStatusCount from '@salesforce/apex/CTHealthTabController.getHealthStatusCount';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import CTRefreshPage from '@salesforce/messageChannel/CTRefreshPage__c';
import { NavigationMixin } from 'lightning/navigation';

export default class HeaderSection extends NavigationMixin(LightningElement) {
    @api
    headerTitle;
    @track
    healthStatusCount = {};

    subscription = null;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    /**
     * Public method to fetch the health status from Apex class.
     * This method is being triggred by parent headerAdminTab.
     * @param {*} title 
     */

    @api
    getHealthStatus(title) {
        this.headerTitle = title;
        getHealthStatusCount({ statusType: title }).then(response => {
            this.prepareHealthStatusCount(response);
        }).catch(error => console.log("Error in fetching Person Health Status Count" + error));
    }

    /**
     * this method is used to show the
     * createRecord Modal.
     */
    createRecord() {
        const objectApiName = (this.headerTitle == 'Person View') ? 'Person__c' : 'Location__c';
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: objectApiName,
                actionName: 'new'
            },
            state: {
                navigationLocation: 'RELATED_LIST'
            }
        });
    }

    /**
     * Private method to prepare the HealthStatus Count 
     * to display on the html page.
     * data is coming from Apex Class
     * @param {*} data 
     */

    prepareHealthStatusCount(data) {
        const emptyStatusCountObj = {
            'Green': 0,
            'Yellow': 0,
            'Orange': 0,
            'Red': 0
        };
        this.healthStatusCount = Object.assign({}, emptyStatusCountObj, data);
    }

    /**
     * Subscribe to the refresh page Message channel
     */

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                CTRefreshPage,
                () => this.handleMessage()
            );
        }
    }

    /**
     * on receiving the refresh page message,
     * it will fetch the latest Status from
     * Apex class.
     */
    handleMessage() {
        this.getHealthStatus(this.headerTitle);
    }

    /**
     * unsubribe to active subscriptions
     */
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading person',
                message: reduceErrors(error).join(', '),
                variant: 'error'
            })
        );
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

}