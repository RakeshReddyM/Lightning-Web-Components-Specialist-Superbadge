import { LightningElement, api, wire, track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

// ...

const SUCCESS_VARIANT = "success"
const SUCCESS_TITLE = "Success"
const MESSAGE_SHIP_IT = "Ship It!"
const CONST_ERROR = "Error"
const ERROR_VARIANT = "error"
const ERROR_TITLE = "Error"

const columns = [
    { label: "Name", fieldName: "Name", editable: true },
    { label: "Length", fieldName: "Length__c", editable: true },
    { label: "Price", fieldName: "Price__c", type: "currency", editable: true },
    { label: "Description", fieldName: "Description__c", editable: true }
]
export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    columns = columns;
    boatTypeId = '';
    error = '';
    @track boats;
    @track draftValues= [];
    isLoading = false;

    // wired message context
    @wire(MessageContext)
    messageContext;
    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    @api searchBoats(boatTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading)
        this.boatTypeId = boatTypeId;
        console.log("boatTypeId" + this.boatTypeId)
    }

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(value) {
            this.boats = value
        if(value.error) {
            this.error = value.error
        }
        this.isLoading = false
        this.notifyLoading(this.isLoading)
    }

    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    @api async refresh() {
        this.isLoading = true
        this.notifyLoading(this.isLoading)
        await refreshApex(this.boats)
        this.isLoading = false
        this.notifyLoading(this.isLoading)

    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId
        console.log("boatId" + this.selectedBoatId)
        this.sendMessageService(event.detail.boatId)
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        const message = { recordId: boatId }
        publish(this.messageContext, BOATMC, message)
    }

    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises)
            .then((results) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: SUCCESS_TITLE,
                        message: MESSAGE_SHIP_IT,
                        variant: SUCCESS_VARIANT
                    })
                )

                this.draftValues = []
                return this.refresh();

            })
            .catch((error) => {
                    console.log("error**" + JSON.stringify(error))
                    this.dispatchEvent(new ShowToastEvent({
                        title: ERROR_TITLE,
                        message: CONST_ERROR,
                        variant: ERROR_VARIANT,
                        
                    }))
            })
            .finally(() => { 
                this.draftValues = []
            });
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'))
        }
        else {
            this.dispatchEvent(new CustomEvent('doneloading'))
        }
    }
}