import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPersonDetails from '@salesforce/apex/CTPersonTabController.getPersonDetails';
const columns = [
    { label: 'Token', fieldName: 'token', type: 'text' },
    { label: 'Contact Status', fieldName: 'status', type: 'text' },
    { label: 'Contact Date', fieldName: 'contactDate', type: 'date' }
];

export default class PersonTab extends LightningElement {

    userInfo;
    columns = columns;
    @track
    headerInfo;
    @track
    subheaderInfo;
    @track
    body;

    getUserInfo(recordId) {
        getPersonDetails({ recordId: recordId }).then(results => {
            if (results && results.name) {
                this.userInfo = results;
                this.prepareCardData();
            } else {
                this.showToast("ERROR", "Please enter valid User id", "error");
            }
        }).catch(error => console.log("error in fetching results" + error));
    }

    headerClass() {
        return this.userInfo?.status ? this.userInfo.status + ' health-header' : 'health-header';
    }

    prepareCardData() {
        const userInfo = this.userInfo;
        this.headerInfo = {
            "class": this.headerClass(),
            "text": `${userInfo.name} , your health status is ${userInfo.status}`
        };
        this.subheaderInfo = [
            {
                'label': 'Phone',
                'value': userInfo.phone
            },
            {
                'label': 'Token',
                'value': userInfo.token
            },
            {
                'label': 'Status Updated On',
                'value': userInfo.statusUpdateOn
            },
            {
                'label': 'Contacts in Last 30 days',
                'value': userInfo.contactsCount
            }
        ];
        this.body = {
            'header': 'Recent Contacts',
            'columns': this.columns,
            'data': userInfo.contacts
        }
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