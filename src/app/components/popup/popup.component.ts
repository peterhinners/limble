import { Component, Input, HostListener, SimpleChanges, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { SelectedUser } from 'src/app/models/selected-user';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  @Input() users!: User[];
  @Input() currentInnerHTML!: string;
  @Input() currentIndex!: number;
  @Output() onUserSelected: EventEmitter<SelectedUser> = new EventEmitter<SelectedUser>(); 
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter(); 

  @ViewChild('popupArea') popupArea!: ElementRef;

  searchPhrase!: string;
  highlightedUserIndex: number = 0;
  filterMetaData = { filteredUsers: [] };

  ngOnChanges(changes: SimpleChanges) {
    this.highlightedUserIndex = 0;
    this.searchPhrase = this.getSearchPhrase(this.currentInnerHTML, this.currentIndex);
  }

  getSearchPhrase(currentInnerHTML: string, currentIndex: number) {
    let searchPhrase = currentInnerHTML.substring(currentIndex);
    
    return this.cleanString(searchPhrase.split(" ")[0]); // Get phrase before they enter space (" ")
  }

  cleanString(input: string) {
    let output = "";
    for (let i = 0; i <input.length; i++) {
      // Only consider ASCII "alphabet" characters
      if ((input.charCodeAt(i) > 64 && input.charCodeAt(i) < 91) || (input.charCodeAt(i) > 96 && input.charCodeAt(i) < 123) || input.charCodeAt(i) == 8) {
        output += input.charAt(i);
      }
    }
    return output;
  }

  selectUser(user: User) {
    this.onUserSelected.emit({user: user, searchPhrase: this.searchPhrase});
    this.highlightedUserIndex = 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) { 

    // Control arrow movement
    if (e.key === "ArrowDown") {
      const upperMostPossibleIndex = this.filterMetaData.filteredUsers.length - 1;
      if (this.highlightedUserIndex < upperMostPossibleIndex) this.highlightedUserIndex++;
    }

    // Control arrow movement
    if (e.key === "ArrowUp") {
      if (this.highlightedUserIndex > 0) this.highlightedUserIndex--;
    }

    // Select user on "Enter"
    if (e.key === "Enter") {
      if (this.filterMetaData.filteredUsers.length) {
        this.selectUser(this.filterMetaData.filteredUsers[this.highlightedUserIndex]);
      }
    }

    if (e.key === "Escape") {
      this.closePopup.emit(true);
    }
 
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if(!this.popupArea.nativeElement.contains(event.target)) {
      this.closePopup.emit(true);
    }
  }

}
