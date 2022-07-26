import { Component } from '@angular/core';
import { Satellite } from './satellite';
import escapeStringRegexp from 'escape-string-regexp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'orbit-report';

  sourceList: Satellite[];
  displayList: Satellite[];

	constructor() {
		this.sourceList = [];
		this.displayList = [];
		let satellitesUrl = 'https://handlers.education.launchcode.org/static/satellites.json';

		window.fetch(satellitesUrl).then(function (response) {
			response.json().then(function (data) {

				let fetchedSatellites = data.satellites;
				// loop over satellites
				for(let i=0; i < fetchedSatellites.length; i++) {
					// create a Satellite object 
					let satellite = new Satellite(fetchedSatellites[i].name, fetchedSatellites[i].type, fetchedSatellites[i].launchDate, fetchedSatellites[i].orbitType, fetchedSatellites[i].operational);
					// add the new Satellite object to sourceList 
					this.sourceList.push(satellite);
				 }

				 // make a copy of the sourceList to be shown to the user
				 this.displayList = this.sourceList.slice(0);
	  
			}.bind(this));
		}.bind(this));

	}

	search(searchTerm: string): void {
		this.advancedSearch(searchTerm);
		/* //original implementation
		let matchingSatellites: Satellite[] = [];
		searchTerm = searchTerm.toLowerCase();
		for(let i=0; i < this.sourceList.length; i++) {
			let name = this.sourceList[i].name.toLowerCase();
			if (name.indexOf(searchTerm) >= 0) {
				matchingSatellites.push(this.sourceList[i]);
			}
		}
		// assign this.displayList to be the array of matching satellites
		// this will cause Angular to re-make the table, but now only containing matches
		this.displayList = matchingSatellites;
		*/
	}

	advancedSearch(searchTerm: string): void { //new implementation for bonus misson
		const matchingSatellites: Satellite[] = [];
		const escapedSearchTerm = escapeStringRegexp(searchTerm);
		const matchExpression = new RegExp(escapedSearchTerm, "i");
		for(const satellite of this.sourceList){
			for (const property in satellite) { 
				if (
					typeof property === "string" //name, type, launchDate, or orbitType
					&& !matchingSatellites.includes(satellite)
					&& matchExpression.test(satellite[property]) //match substring, case insensitive
				) {
					matchingSatellites.push(satellite);
				}
			}
		}
		this.displayList = matchingSatellites;
	}

}
