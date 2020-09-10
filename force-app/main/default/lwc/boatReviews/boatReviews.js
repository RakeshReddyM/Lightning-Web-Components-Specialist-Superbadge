import { LightningElement, api, track } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation'
// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    @track boatReviews;
    isLoading = false;
    isRendered;

    // Getter and Setter to allow for logic to run on recordId change
    @api get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
        this.getReviews();
    }

    // Getter to determine if there are reviews to display
    get reviewsToShow() {

        if (this.boatReviews == '' || this.boatReviews == 'undefined') {

            return false;
        }
        else {

            return true;
        }
        // return this.boatReviews ? true : false

    }

    // Public method to force a refresh of the reviews invoking getReviews
    @api refresh() {
        this.getReviews()
    }

    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    // renderedCallback() {
    //     if (this.isRendered) {
    //         return;
    //     }
    //     this.isRendered = true
    //     this.getReviews()
    // }
    getReviews() {
        this.isLoading=true
        getAllReviews({ boatId: this.boatId }).then((result) => {
            console.log("boatreview" + JSON.stringify(result))
            this.boatReviews = result
            this.isLoading = false
        }).catch(error => {
            this.isLoading=false
            console.log("error" + JSON.stringify(error))
        })
    }


    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {
        event.preventDefault();
        console.log("event@@" + JSON.stringify(event.target.dataset.recordId))
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.recordId,
                actionName: "view",
            },
        });
    }
}
