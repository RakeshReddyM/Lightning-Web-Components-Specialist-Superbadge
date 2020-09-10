import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false
    boatTypeId='';

    createNewBoat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "New",
                objectApiName: "Boat__c"
            }
        });
    }

    searchBoats(event) {
        console.log("event"+JSON.stringify(event.detail))
        this.boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-results').searchBoats(this.boatTypeId);
    }

    handleLoading(event){
        this.isLoading = true
    }
    handleDoneLoading(event){
        this.isLoading = false
    }
}