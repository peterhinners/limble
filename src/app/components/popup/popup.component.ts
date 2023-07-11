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

    currentInnerHTML = currentInnerHTML.replace(/&nbsp;/g, ' ');

    let character = currentInnerHTML.charAt(currentIndex);
    console.log("filter current index: ", currentIndex);
    console.log("filter character: ", character);
    console.log("filter currentInnerHTML: ", currentInnerHTML);

    // var mySubString = currentInnerHTML.substring(
    //   currentIndex + 1, 
    //   currentInnerHTML.lastIndexOf(" ")
    // );

    let secondHalf = currentInnerHTML.substring(currentIndex);

    return secondHalf.split(" ")[0];
  }

  selectUser(user: User) {
    console.log("selected user: ", user);
    this.onUserSelected.emit({user: user, searchPhrase: this.searchPhrase});
  }


 

  getDesiredUser() {

    


  }

}
