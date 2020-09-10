import { LightningElement } from 'lwc';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactCreator extends LightningElement {
    recordId;
    objectApiName = CONTACT_OBJECT.objectApiName;
    fields = [CONTACT_FIRSTNAME_FIELD, CONTACT_LASTNAME_FIELD, CONTACT_EMAIL_FIELD];

    handleSuccess(event) {
        this.recordId = event.detail.id;
        const showtoast = new ShowToastEvent({
            variant: "success",
            tilte: "Success",
            message: `Contact ${this.recordId} has been created successfully`
        })

        this.dispatchEvent(showtoast);
    }


}