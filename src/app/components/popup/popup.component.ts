import { Component, Input, OnInit, HostListener, SimpleChanges, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { SelectedUser } from 'src/app/models/selected-user';
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
  @Output() onUserSelected: EventEmitter<SelectedUser> = new EventEmitter<SelectedUser>(); 
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter(); 

  @ViewChild('popupArea') popupArea!: ElementRef;

  searchPhrase!: string;
  highlightedUserIndex: number = 0;
  // filteredUserMeta: User[] = [];
  filterMetaData = { filteredUsers: [] };

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

    this.highlightedUserIndex = 0;
  }

  getSearchPhrase(currentInnerHTML: string, currentIndex: number) {
    // currentIndex--;

    console.log("filter currentInnerHTML1: ", currentInnerHTML);

    currentInnerHTML = currentInnerHTML.replace(/&nbsp;/g, ' ');
    // handle known Firefox bug with "<br>"
    currentInnerHTML = currentInnerHTML.replace(/<br>/g, '');

    currentInnerHTML = currentInnerHTML.replace(/\u0001/g, '');

    // if (currentInnerHTML.endsWith("<br>")) {
    //   currentInnerHTML = currentInnerHTML.slice(0, 4);
    // }

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
    this.highlightedUserIndex = 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) { 
    // e.stopPropagation();
    console.log("arrow e: ", e);
    if (e.key === "ArrowDown") {
      console.log("arrow down");

      const upperMostPossibleIndex = this.filterMetaData.filteredUsers.length - 1;
      if (this.highlightedUserIndex < upperMostPossibleIndex) this.highlightedUserIndex++;
    }

    if (e.key === "ArrowUp") {
      console.log("arrow up");
      if (this.highlightedUserIndex > 0) this.highlightedUserIndex--;
    }

    if (e.key === "Enter") {
      console.log("Enter Key");
      console.log("this.filterMetaData: ", this.filterMetaData);
      if (this.filterMetaData.filteredUsers.length) {
        this.selectUser(this.filterMetaData.filteredUsers[this.highlightedUserIndex]);
      }
    }

    if (e.key === "Escape") {
      this.closePopup.emit(true);
    }
    // this.key = event.key;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if(!this.popupArea.nativeElement.contains(event.target)) {
      this.closePopup.emit(true);
    }
  }

  

}
