import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input() users!: User[];
  // @Input() lastInnerHTML!: string;
  @Input() currentInnerHTML!: string;
  @Input() currentIndex!: number;

  // @Output() onUserSelected = new EventEmitter<User>();
  @Output() onUserSelected = new EventEmitter<{user: User, searchPhrase: string}>();  

  searchPhrase!: string;
  desiredUser: string = '';

  ngOnInit(): void {

    // let searchPhrase = this.getSearchPhrase(this.currentInnerHTML, this.currentIndex);
    // console.log("searchPhrase: ", searchPhrase);

    
    // console.log("popup currentInnerHTML: ", this.currentInnerHTML);
    // console.log("popup lastInnerHTML: ", this.lastInnerHTML);

    // let ci = this.currentInnerHTML.replace(/&nbsp;/g, ' ');
    // let li = this.lastInnerHTML.replace(/&nbsp;/g, ' ');

    // console.log("popup ci: ", ci);
    // console.log("popup li: ", li);

    // this.currentInnerHTML = this.currentInnerHTML.replace(/&nbsp;/g, ' ');
    // this.lastInnerHTML = this.lastInnerHTML.replace(/&nbsp;/g, ' ');


  }

  ngOnChanges(changes: SimpleChanges) {
    this.searchPhrase = this.getSearchPhrase(this.currentInnerHTML, this.currentIndex);
    console.log("searchPhrase: ", this.searchPhrase);
  }

  getSearchPhrase(currentInnerHTML: string, currentIndex: number) {
    // currentIndex--;

    console.log("filter currentInnerHTML1: ", currentInnerHTML);

    currentInnerHTML = currentInnerHTML.replace(/&nbsp;/g, ' ');

    // if (currentInnerHTML.endsWith('&nbsp;')) {
    //   // currentInnerHTML = currentInnerHTML.replace(/&nbsp;/g, ' ');
    //   currentInnerHTML = currentInnerHTML.slice(0, '&nbsp;'.length);
    // }

    let character = currentInnerHTML.charAt(currentIndex);
    console.log("filter current index: ", currentIndex);
    console.log("filter character: ", character);
    console.log("filter currentInnerHTML2: ", currentInnerHTML);

    // var mySubString = currentInnerHTML.substring(
    //   currentIndex + 1, 
    //   currentInnerHTML.lastIndexOf(" ")
    // );

    let secondHalf = currentInnerHTML.substring(currentIndex);

    console.log("filter secondHalf: ", secondHalf);

    let result = secondHalf.split(" ")[0];

    // if (result.startsWith('\u0001')) result = '';

    return this.cleanString(secondHalf.split(" ")[0]);
  }

  cleanString(input: string) {
    var output = "";
    for (var i=0; i<input.length; i++) {

      if ((input.charCodeAt(i) > 64 && input.charCodeAt(i) < 91) || (input.charCodeAt(i) > 96 && input.charCodeAt(i) < 123) || input.charCodeAt(i) == 8) {
        output += input.charAt(i);
      }

        // if (input.charCodeAt(i) <= 127) {
        //     output += input.charAt(i);
        // }
    }
    return output;
  }

  selectUser(user: User) {
    console.log("selected user: ", user);
    console.log("this.searchPhrase: ", this.searchPhrase);
    this.onUserSelected.emit({user: user, searchPhrase: this.searchPhrase});
  }


 

  getDesiredUser() {

    


  }

}
