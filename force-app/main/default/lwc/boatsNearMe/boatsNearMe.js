import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
@api boatTypeId;
mapMarkers = [];
isLoading = true;
isRendered;
latitude;
longitude;
get showMap(){
return this.mapMarkers.length
}

@wire(getBoatsByLocation,{ latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId'})
wiredBoatsJSON({ error, data }) {

if(data){
this.isLoading = false
console.log("wiredBoatsJSON data", data)
this.createMapMarkers(data)
}
if(error){
this.isLoading = false
this.dispatchEvent(
new ShowToastEvent({
title: ERROR_TITLE,
variant: ERROR_VARIANT
})
);
}
}

// Controls the isRendered property
// Calls getLocationFromBrowser()
renderedCallback() {
if (this.isRendered){
return
}
this.isRendered = true
this.getLocationFromBrowser()
}

// Gets the location from the Browser
// position => {latitude and longitude}
getLocationFromBrowser() {
this.isLoading = false
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(position=> {
this.latitude = position.coords.latitude;
this.longitude = position.coords.longitude;
this.loading = false;
});
}
}

// Creates the map markers
createMapMarkers(boatData) {
this.mapMarkers = JSON.parse(boatData).map(boat=>{
const Latitude = boat.Geolocation__Latitude__s;
const Longitude = boat.Geolocation__Longitude__s;
return {
location: { Latitude, Longitude },
title: boat.Name

}
})
this.mapMarkers.unshift({
location: {
Latitude: this.latitude,
Longitude: this.longitude,
},
icon: ICON_STANDARD_USER,
title: LABEL_YOU_ARE_HERE
});
}
}