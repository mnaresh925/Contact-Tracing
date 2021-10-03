import { LightningElement, api } from 'lwc';

export default class CardContainer extends LightningElement {
    @api
    header;
    @api
    subheader;
    @api
    body;
}