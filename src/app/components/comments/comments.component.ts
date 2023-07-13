import { Component, ViewEncapsulation, Inject, OnDestroy, OnInit, Renderer2, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { Tag } from 'src/app/models/tag';
import { CommentData } from 'src/app/services/comment-data';
import { DOCUMENT } from '@angular/common'; 
import { SelectedUser } from 'src/app/models/selected-user';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentsComponent implements OnInit, OnDestroy, AfterViewInit {

  comments!: Comment[];
  users!: User[];
  subscriptions: Subscription[] = [];
  showSubmitButton: boolean = false;
  lastFakeCommentId: number = 5; // for demo purposes
  popupOpen: boolean = false;
  lastInnerHTML: string = '';
  currentInnerHTML: string = '';
  currentIndex!: number;
  tagId: number = 0;
  lastAtSignIndex!: number;

  private inputListener!: () => void;
  private keydownListener!: () => void;

  @ViewChild('editableContent') editableContent!: ElementRef;

  constructor(private commentDataService: CommentData, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {

    this.subscriptions.push(
      this.commentDataService.getComments().subscribe(data => {
        this.comments = data;
      })
    );

    // DISCUSS: instead of the below call, consider getting the user data when first opening 
    // the comment area, so the "status" of the users is relatively fresh. Or alternativly, 
    // fetch user data when the user types the "@" sign -- though this could potentially 
    // cause a slight delay when opening the popup
    this.subscriptions.push(
      this.commentDataService.getUsers().subscribe(data => {
        this.users = data;
      })
    );
  }

  ngAfterViewInit(): void {
    // Listen for input events on the editablecontent area
    this.inputListener = this.renderer.listen(this.editableContent.nativeElement, "input", event => {

      let currentInnerHTML = event.target.innerHTML;
      currentInnerHTML = currentInnerHTML.replace(/<br>/g, ''); // Known Firefox oddity of inserting <br> tags everywhere
      currentInnerHTML = currentInnerHTML.replace(/&nbsp;/g, ' '); // &nbsp; interferes with index counting and searchPhrase construction
      this.currentInnerHTML = currentInnerHTML;

      if (event.inputType == "deleteContentBackward") {

        const target = this.document.createTextNode("\u0001");
        this.document.getSelection()?.getRangeAt(0).insertNode(target);
        this.currentIndex = event.target.innerHTML.indexOf("\u0001");
        target.parentNode?.removeChild(target);

        const numberOfUnicodes = (event.target.innerHTML.match(/\\u0001/g) || []).length;
        const numberOfWhiteSpaces = (event.target.innerHTML.match(/&nbsp;/g) || []).length;
        const irrelavantCharactersToSubtract = (numberOfWhiteSpaces * 6) + (numberOfUnicodes * 6);

        // If the user had the @ popup open, and was typing in characters, but then deleted
        // everything (including the @ sign) before choosing a user, close popup, zero-out lastAtSignIndex
        if (this.lastAtSignIndex - 1 === (this.currentIndex - irrelavantCharactersToSubtract)) {
          this.close();
          return;
        }

        this.handleDelete(event.target.innerHTML);
      }
      
      // When user types "@"
      if (event.data === "@") {
        // Set the currentIndex within the innerHTML that the "@" was entered, open popup
        const target = this.document.createTextNode("\u0001");
        this.document?.getSelection()?.getRangeAt(0).insertNode(target);
        this.currentIndex = event.target.innerHTML.indexOf("\u0001");
        this.lastAtSignIndex = this.currentIndex - 1;
        target.parentNode?.removeChild(target);

        this.open();
      }

      // Close popup if user enters space
      if (event.data === " ") {
        this.close();
      }

    });

    // Disable default up and down arrow behavior if editableContent is open, 
    // to allow up and down arrows to inform the tag selection
    this.keydownListener = this.renderer.listen(this.editableContent.nativeElement, "keydown", e => {
     
      if (this.showSubmitButton && 
        e.key === 'ArrowUp' || 
        e.key === 'ArrowDown' || 
        e.key === "Enter" || 
        e.key === "Escape") {
        
        return false;
      }

      return true;
    });

  }

  handleDelete(innerHTML: string) {
    const beforeIndex = innerHTML.substring(0, this.currentIndex);
    const afterIndex = innerHTML.substring(this.currentIndex);

    // We know we're in a specially tagged element (potentially bolded tag)
    // Try and ferret out the data-tag-id value
    if (afterIndex.startsWith("</span>")) {
      
      let dataTagIdAttribute = '';
      let dataTagId = '';

      // Iterate backwards -- prior to the current index -- and see if can form "data-tag-id"
      for (let len = beforeIndex.length, i = len - 1; i > -1; i--) {
        
        dataTagIdAttribute = beforeIndex[i] + dataTagIdAttribute;

        if (dataTagIdAttribute.startsWith("data-tag-id")) break;
      }

      if (dataTagIdAttribute.startsWith("data-tag-id")) {
        // Get the id, piecemeal, going forward
        let idBuilder = dataTagIdAttribute.substring('data-tag-id="'.length);
        for (let i = 0; i < idBuilder.length; i++) {
          if (idBuilder.charAt(i) >= '0' && idBuilder.charAt(i) <= '9') {
            dataTagId += idBuilder.charAt(i);
          } else {
            break;
          }
        }
      }

      // Remove the bolded user tag node
      if (dataTagId) {
        const nodeToRemove = this.editableContent.nativeElement.querySelectorAll('[data-tag-id="' + dataTagId + '"]')[0];

        this.editableContent.nativeElement.removeChild(nodeToRemove);
      }
    }
  }

  open() {
    this.popupOpen = true;
  }

  close() {
    this.popupOpen = false;
    this.lastAtSignIndex = -1;
  }

  selectUser(event: SelectedUser) {
    this.close();
    this.tagId++;
    
    const htmlBeforeIndex = this.currentInnerHTML.substring(0, this.currentIndex - 1);
    let htmlAfterIndex = this.currentInnerHTML.substring(this.currentIndex);
    // remove the typed-in searchPhrase letters, as they will be replaced by the bolded user tag
    htmlAfterIndex = htmlAfterIndex.substring(event.searchPhrase.length);

    // Create the new inner HTML, and add a placeholder non-visible character (unicode) at the end
    // so the user can skip over the bolded user tag node, if there is no text to the right
    this.currentInnerHTML = htmlBeforeIndex + 
    '<span class="make-bold no-user-select" data-recipient-user-id="' + event.user.userID + '" data-tag-id="' + this.tagId +  '">' + '@' + event.user.firstName + " " + event.user.lastName + '</span>' + '\u0001' + htmlAfterIndex;

    // Add bolded user tag node to the DOM
    this.renderer.setProperty(this.editableContent.nativeElement, 'innerHTML', this.currentInnerHTML);

    // Get the newly created node to figure out where it's positioned, so we 
    // can correctly position the caret afterwards
    const newNode = this.editableContent.nativeElement.querySelectorAll('[data-tag-id="' + this.tagId + '"]')[0];

    const childNodes = this.editableContent.nativeElement.childNodes;
    let numberOfNodesBeforeNewNode = 0;
    // Since childNodes are zero-indexed, the newNode's index also happens to be the number of prior nodes
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i] == newNode) numberOfNodesBeforeNewNode = i;
    }

    const el = this.document.getElementById("editable-content");
    const range = this.document.createRange();
    const sel = window.getSelection();
    // Works! but keeps old class
    if (el) {
      range.setStartAfter(el.childNodes[numberOfNodesBeforeNewNode]);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  toggleSubmitButton() {
    if (this.showSubmitButton && this.editableContent.nativeElement.innerText) {
      this.submitComment();
    } else {
      this.showSubmitButton = true;
      this.editableContent.nativeElement.focus();
    }
  }

  submitComment() {
    this.lastFakeCommentId++; // In lieu of actually persisting, for demo purposes

    let finalHtml = this.editableContent.nativeElement.innerHTML;

    // Remove unicode character helpers
    finalHtml = finalHtml.replace(/\u0001/g, '');

    const childNodes = this.editableContent.nativeElement.childNodes;

    let tags: Tag[] = [];

    // Compile a list of "tags" (tag model has info on the bolded tag node, such as recipientUserId
    // and senderUserId)
    for (let i = 0; i < childNodes.length; i++) {

      if (childNodes[i].className && childNodes[i].className.indexOf("make-bold") > -1) {

        const tag: Tag = {id: parseInt(childNodes[i].getAttribute('data-tag-id')), recipientUserId: parseInt(childNodes[i].getAttribute('data-recipient-user-id')), senderUserId: this.commentDataService.getCurrentUserId()};

        tags.push(tag);
      }
    }

    // Persist to backend in real life, but here just pushing to comments
    this.comments.push({ id: this.lastFakeCommentId, userID: this.commentDataService.getCurrentUserId(), text: finalHtml, date: new Date() });

    // Alert the tagged users, this could possibly be combined with the comment persisting
    this.commentDataService.alertTaggedUsers(tags)
      
    this.clearContentEditable();
  }

  clearContentEditable() {
    this.showSubmitButton = false;
    this.renderer.setProperty(this.editableContent.nativeElement, 'innerHTML', '');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.inputListener();
    this.keydownListener();
  }




  



  

}
