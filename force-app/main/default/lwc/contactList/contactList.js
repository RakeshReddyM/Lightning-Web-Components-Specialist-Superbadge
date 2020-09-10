import { LightningElement, wire } from 'lwc';
import CONTACT_FIRSTNAME from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL from '@salesforce/schema/Contact.Email';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import { reduceErrors } from 'c/ldsUtils';

const columns = [
    { label: "FirstName", fieldName: CONTACT_FIRSTNAME.fieldApiName, type: "text" },
    { label: "LastName", fieldName: CONTACT_LASTNAME.fieldApiName, type: "text" },
    { label: "Email", fieldName: CONTACT_EMAIL.fieldApiName, type: "Email" }
]

export default class ContactList extends LightningElement {

    columns = columns
    @wire(getContacts) contacts;

    get errors() {
        return this.contacts.error ? reduceErrors(this.contacts.error) : [];
    }

}