import { ChangeDetectorRef, Component, ViewEncapsulation, Inject, OnDestroy, OnInit, Renderer2, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { Tag } from 'src/app/models/tag';
import { CommentData } from 'src/app/services/comment-data';
import {DomSanitizer} from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common'; 
import { forEachChild } from 'typescript';

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

  private unlistener!: () => void;
  private unlistener2!: () => void;

  @ViewChild('editableContent') editableContent!: ElementRef;

  constructor(private commentDataService: CommentData, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {

    this.subscriptions.push(
      this.commentDataService.getComments().subscribe(data => {
        console.log("comment data ", data)
        this.comments = data;
      })
    );

    this.subscriptions.push(
      this.commentDataService.getUsers().subscribe(data => {
        console.log("user data ", data)
        this.users = data;
      })
    );
    
  }

  ngAfterViewInit(): void {

  

  
  
     this.unlistener = this.renderer.listen(this.editableContent.nativeElement, "input", event => {


      console.log("listener event ", event);
      
     
      let currentInnerHTML = event.target.innerHTML;
      currentInnerHTML = currentInnerHTML.replace(/<br>/g, '');
      currentInnerHTML = currentInnerHTML.replace(/&nbsp;/g, ' ');
      this.currentInnerHTML = currentInnerHTML;
      

      // if (navigator.userAgent.includes("Firefox") && event.target.innerHTML.endsWith("<br>")) {
      //   // handle known firefox <br> bug, see: https://bugzilla.mozilla.org/show_bug.cgi?id=1615852
      //   this.currentInnerHTML = event.target.innerHTML.slice(0, -4);
      // }

      // this.currentInnerHTML = event.target.innerHTML.replace(/&nbsp;/g, ' ');

      // this.currentInnerHTML = event.target.innerHTML;

      console.log("listener this.currentInnerHTML", this.currentInnerHTML);

      if (event.inputType == "deleteContentBackward") {

        const target = this.document.createTextNode("\u0001");
        this.document.getSelection()?.getRangeAt(0).insertNode(target);

       


        this.currentIndex = event.target.innerHTML.indexOf("\u0001");
        target.parentNode?.removeChild(target);

        console.log("weird event.target.innerHTML: ", event.target.innerHTML);

        var numberOfUnicodes = (event.target.innerHTML.match(/\\u0001/g) || []).length;
        var numberOfWhiteSpaces = (event.target.innerHTML.match(/&nbsp;/g) || []).length;

        // console.log("numberOfBreakTags ", numberOfBreakTags);
        console.log("numberOfWhiteSpaces ", numberOfWhiteSpaces);

        const irrelavantCharactersToSubtract = (numberOfWhiteSpaces * 6) + (numberOfUnicodes * 6);

        // if (currentInnerHTML.endsWith("<br>")) currentInnerHTML = currentInnerHTML.substring(0, currentInnerHTML.length - 4);
        // if (event.target.innerHTML.endsWith("&nbsp;")) {
        //   console.log("endsWithSpace");
        // } else {
        //   console.log("does not endsWithSpace");
        // }
        // this.currentIndex = currentIndex;
        // this.currentIndex = currentIndex - irrelavantCharactersToSubtract;

        console.log("delete this.lastAtSignIndex: ", this.lastAtSignIndex)
        console.log("delete this.currentIndex: ", this.currentIndex)
        console.log("delete this.currentIndex - irrelavantCharactersToSubtract: ", this.currentIndex - irrelavantCharactersToSubtract)
        console.log("delete this.currentInnerHTML: ", this.currentInnerHTML)

        

        if (this.lastAtSignIndex - 1 === (this.currentIndex - irrelavantCharactersToSubtract)) {
          this.close();
          return;
        }

        this.handleDelete(event.target.innerHTML);
      }
      


      if (event.data === "@") {
        // console.log("yeppers");
        // console.log("event.target.selectionStart, ", event.target?.selectionStart);

        // console.log("last html ", this.lastInnerHTML);
        // console.log("current html ", event.target.innerHTML);

        // this.currentIndex = this.getCursorIndex(event.target.innerHTML);

      const target = this.document.createTextNode("\u0001");
      this.document?.getSelection()?.getRangeAt(0).insertNode(target);
      this.currentIndex = event.target.innerHTML.indexOf("\u0001");
      this.lastAtSignIndex = this.currentIndex - 1;
      target.parentNode?.removeChild(target);

        // let difference = patienceDiff( a.split(""), b.split("") );

        this.open();
      }

      if (event.data === " ") {
        this.close();
      }

      console.log("comments this.lastInnerHTML: ", this.lastInnerHTML);
      console.log("comments this.currentInnerHTML: ", this.currentInnerHTML);

    });

    // Disable default up and down arrow behavior if editableContent is open, 
    // to allow up and down arrows to inform the tag selection
    this.unlistener2 = this.renderer.listen(this.editableContent.nativeElement, "keydown", e => {
     
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
    let before = innerHTML.substring(0, this.currentIndex);
        let after = innerHTML.substring(this.currentIndex);

        if (after.startsWith("</span>")) {
          
          let dataTagId = '';

          // data-tag-id=
          let goal = '';

          for (let len = before.length, i = len - 1; i > -1; i--) {
           
            goal = before[i] + goal;

            if (goal.startsWith("data-tag-id")) break;
          }

          if (goal.startsWith("data-tag-id")) {

            let hunch2 = goal.substring('data-tag-id="'.length);
            

            for (var i = 0; i < hunch2.length; i++) {

              if (hunch2.charAt(i) >= '0' && hunch2.charAt(i) <= '9') {
                dataTagId += hunch2.charAt(i);
              } else {
                break;
              }
              // alert(hunch2.charAt(i));
            }

            let hmm = hunch2[0];
            
          }

        
          let nodeToRemove = this.editableContent.nativeElement.querySelectorAll('[data-tag-id="' + dataTagId + '"]')[0];

          this.editableContent.nativeElement.removeChild(nodeToRemove);
          
        }
  }

  
  open() {
    this.popupOpen = true;
    // this.commentDataService.open();
  }

  close() {
    console.log("CLOSING TIME");
    this.popupOpen = false;
    this.lastAtSignIndex = -1;
    // this.commentDataService.close();
  }

  selectUser(event: any) {
    this.close();
    this.tagId++;
    console.log("comments $event: ", event);
    console.log("comments event.searchPhrase: ", event.searchPhrase);
    console.log("comments this.currentIndex: ", this.currentIndex);
    
    console.log("comments this.currentInnerHTML: ", this.currentInnerHTML);

    let thingy1 = this.currentInnerHTML.substring(0, this.currentIndex - 1);
    let thingy2 = this.currentInnerHTML.substring(this.currentIndex);
    

    thingy2 = thingy2.substring(event.searchPhrase.length);

    console.log("thingy1: ", thingy1);
    console.log("thingy2: ", thingy2);

    let innerHtmlParts = this.currentInnerHTML.split("@" + event.searchPhrase);

    // console.log("innerHtmlParts: ", innerHtmlParts);
    // console.log("innerHtmlParts[0]: ", innerHtmlParts[0]);
    // \u0001

    // if (!thingy2) thingy2 = '\u0001';

    this.currentInnerHTML = thingy1 + 
    '<span class="make-bold no-user-select" data-recipient-user-id="' + event.user.userID + '" data-tag-id="' + this.tagId +  '">' + '@' + event.user.firstName + " " + event.user.lastName + '</span>' + '\u0001' + thingy2;

    // this.currentInnerHTML = innerHtmlParts[0] + 
    // '<span class="make-bold" data-tag-id="' + this.tagId +  '" data-recipient-user-id="' + event.user.userID + '" data-comment-id="' + this.lastFakeCommentId + '">' + '@' + event.user.name + '</span>' + innerHtmlParts[1];

    this.renderer.setProperty(this.editableContent.nativeElement, 'innerHTML', this.currentInnerHTML);

  
    // const newNode = this.document.querySelectorAll('[data-tag-id="' + this.tagId + '"]')[0];
    const newNode = this.editableContent.nativeElement.querySelectorAll('[data-tag-id="' + this.tagId + '"]')[0];

    const nodeList = this.editableContent.nativeElement.children;

    console.log("newNode------------- : ", newNode);
    console.log("nodeList------------- : ", nodeList);

    let childNodes = this.editableContent.nativeElement.childNodes;
    console.log("childNodes------------- : ", childNodes);

    let numberOfPriorNodes = 0;
    // Since childNodes are zero-indexed, the newNode's index also happens to be the number of prior nodes
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i] == newNode) numberOfPriorNodes = i;
    }

    console.log("numberOfPriorNodes------------- : ", numberOfPriorNodes);

   

    
   const el = this.document.getElementById("editable-content");
    const range = this.document.createRange();
    const sel = window.getSelection();
    // Works! but keeps old class
    if (el) {

      // let okThen = el.findIndex(elem => elem.id == idToSearch)
      console.log("el.childNodes: ", el.childNodes);
      // const newDiv = document.createElement("span");
      // range.insertNode((suffixNode = this.document.createTextNode(' ')));
      // range.setStartAfter(el.childNodes[numberOfPriorNodes]);


      range.setStartAfter(el.childNodes[numberOfPriorNodes]);
      // range.setStart(el.childNodes[1], 1);
    range.collapse(true);
    
    sel?.removeAllRanges();
    sel?.addRange(range);
    }

    // works!, kind of

    // var el = document.getElementById("editable-content");
    // var range = document.createRange();
    // var sel = window.getSelection();
    // // Works! but keeps old class
    // if (el) {
    //   console.log("el.childNodes: ", el.childNodes);
    //   range.setStart(el.childNodes[1], 1);
    // range.collapse(true);
    
    // sel?.removeAllRanges();
    // sel?.addRange(range);
    // }
    
    

  //   let el: any = this.document.getElementById('editable-content')

  //   el?.focus();
  // let range = document.createRange()
  //   , sel   = window.getSelection()
  //   ;

  //   console.log("sel:: ", sel)
  // range.setStart(el?.firstChild, 2)
  // range.setEnd(el.firstChild, 2)
  // sel?.removeAllRanges()
  // sel?.addRange(range)
    


    console.log("comments innerHtmlParts: ", innerHtmlParts);
    console.log("comments this.currentInnerHTML: ", this.currentInnerHTML);

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
  
    console.log("this.editableContent, ", this.editableContent);
    console.log("this.editableContent?.nativeElement.innerHTML, ", this.editableContent?.nativeElement.innerHTML);
    console.log("this.editableContent.nativeElement?.innerText, ", this.editableContent?.nativeElement.innerText);
    
    this.lastFakeCommentId++;

    let finalHtml = this.editableContent.nativeElement.innerHTML;

    finalHtml = finalHtml.replace(/\u0001/g, '');

    console.log("finalHtml: ", finalHtml);

    const childNodes = this.editableContent.nativeElement.childNodes;

    let tags: Tag[] = [];

    for (let i = 0; i < childNodes.length; i++) {

      if (childNodes[i].className && childNodes[i].className.indexOf("make-bold") > -1) {

        const tag: Tag = {id: parseInt(childNodes[i].getAttribute('data-tag-id')), recipientUserId: parseInt(childNodes[i].getAttribute('data-recipient-user-id')), senderUserId: this.commentDataService.getCurrentUserId()};

        tags.push(tag);
      }
    }

    // persist to backend in real life, but here just pushing to comments
    this.comments.push({ id: this.lastFakeCommentId, userID: this.commentDataService.getCurrentUserId(), text: finalHtml, date: new Date() });

    // alert the tagged users, this could possibly be combined with the comment persisting
    this.commentDataService.alertTaggedUsers(tags)
      
    this.clearContentEditable();
  }

  clearContentEditable() {
    this.showSubmitButton = false;
    this.renderer.setProperty(this.editableContent.nativeElement, 'innerHTML', '');
    // this.renderer.setProperty(this.editableContent?.nativeElement, 'innerHTML', '');
    console.log("clearContentEditable this.editableContent, ", this.editableContent);
    console.log("clearContentEditable this.editableContent?.nativeElement.innerHTML, ", this.editableContent?.nativeElement.innerHTML);
    console.log("clearContentEditable this.editableContent.nativeElement?.innerText, ", this.editableContent?.nativeElement.innerText);

  }


  

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.unlistener();
    this.unlistener2();
  }




  



  

}
