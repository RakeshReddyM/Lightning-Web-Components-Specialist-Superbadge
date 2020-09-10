import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ComplaintForm extends NavigationMixin(LightningElement) {

    recordId;
    handlesubmit(event) {
        event.preventDefault();
        console.log("priority" + JSON.stringify(event.detail))
        let Priority = this.template.querySelector('.priority');
        if (Priority.value === "Medium") {
            console.log("priority value" + Priority.value);
            Priority.setCustomValidity("");
            Priority.reportValidity();
        }
        else {
            this.template.querySelector('lightning-record-edit-form').submit();
        }


    }
    successhandler(event) {
        console.log("event details" + JSON.stringify(event.detail));
        const caseDetails = event.detail;
        this.recordId = caseDetails.id;
        const showToast = new ShowToastEvent({
            title: "Success",
            message: `Case Number ${caseDetails.fields.CaseNumber.value} has been created successfully`,
            variant: "success"
        })
        this.dispatchEvent(showToast);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: this.recordId,
                objectApiName: "Case"
            }
        });
        
    };

    errorhandler(event) {
        console.log("error event details" + JSON.stringify(event.detail));
        const showToast = new ShowToastEvent({
            title: "Success",
            message: "Case Could not be created",
            variant: "error"
        })
        this.dispatchEvent(showToast);

    }
}