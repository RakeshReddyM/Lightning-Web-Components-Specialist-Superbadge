/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import getconatcts from '@salesforce/apex/contactsearch.getcontacts';
import searchcontacts from '@salesforce/apex/contactsearch.searchcontacts';
import { updateRecord } from 'lightning/uiRecordApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import {refreshApex} from '@salesforce/apex'
const columns = [

    {
        label: 'FirstName',
        fieldName: 'FirstName',
        editable: true
    },
    {
        label: 'LastName',
        fieldName: 'LastName',
        editable: true
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone'
    },
    {
        label: 'Email',
        fieldName: 'Email',
        type: 'email'
    }
];

export default class SearchContacts extends LightningElement {
    @track columns = columns;
    @track data;
    @track error;
    @track draftValues=[];

    wiredContactResult;

    @wire(getconatcts) 
    wiredContacts(result) {
   this.wiredContactResult = result;
        if (result.data) {
            this.data = result.data;
        }
        if (result.error) {
            this.error = result.error;
        }

    }

    handlechange(event) {
        const search = event.target.value;
        searchcontacts({ search }).then(
            (result) => {
                this.data = result;
            }
        ).catch(
            error => {
                this.error = error;
            }
        )

    }

    handleSave(event) {

        const recordInputs = event.detail.draftValues.map(draft => {

            const fields = Object.assign({},draft);
            console.log("draftList"+ JSON.stringify(fields) );
            return {fields} ;

        });

        const promises = recordInputs.map(recordInput =>  updateRecord(recordInput) )

        Promise.all(promises).then(contacts => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Success',
                    message: 'Contact Updated',
                    variant : 'success'
                })
            );

            this.draftValues = [];
            return refreshApex(this.wiredContactResult);
        }).catch(error =>{

        })

        console.log("saveevent" + JSON.stringify(event.detail.draftValues));
        // console.log("fields"+recordInputs);
    }
}