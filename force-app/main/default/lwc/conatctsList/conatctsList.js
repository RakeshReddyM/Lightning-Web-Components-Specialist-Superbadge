/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement,track,wire,api } from 'lwc';
import fetchContacts from '@salesforce/apex/fetchContacts.Contacts';
import {NavigationMixin} from 'lightning/navigation';

export default class ConatctsList extends NavigationMixin(LightningElement) {
    
    @api recordId;
    @track contactId;
    @wire(fetchContacts,{Account:'$recordId'})contacts;

    handleClick(event){
        console.log("event"+event);
        this.contactId=event.target.id.substring(0,18);
        // alert(this.contactId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "edit",
                recordId: this.contactId,
                objectApiName: "Contact"
            }
        });
    }
}