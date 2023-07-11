import { ChangeDetectorRef, Component, ViewEncapsulation, Inject, OnDestroy, OnInit, Renderer2, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { CommentData } from 'src/app/services/comment-data';
import {DomSanitizer} from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common'; 



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
  addCommentButton: boolean = true;
  newComment: string = "";
  lastFakeCommentId: number = 5;
  

  popupOpen: boolean = false;
  lastInnerHTML: string = '';
  currentInnerHTML: string = '';
  currentIndex!: number;
  

  private unlistener!: () => void;

  @ViewChild('editableContent') editableContent?: ElementRef;

  constructor(private commentDataService: CommentData, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, private ref: ChangeDetectorRef) {}

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


      // let hmmm = this.getPreviousSiblings(this.editableContent?.nativeElement, 'shoe');
      // console.log("hmm ", hmmm);
    
     this.unlistener = this.renderer.listen(this.editableContent?.nativeElement, "input", event => {
     
      console.log("event: ", event);
      console.log("event.target.innerHTML: ", event.target.innerHTML);
      

      this.currentInnerHTML = event.target.innerHTML;

      

      // console.log("hail mary ", position);

      if (event.data === "@") {
        // console.log("yeppers");
        // console.log("event.target.selectionStart, ", event.target?.selectionStart);

        // console.log("last html ", this.lastInnerHTML);
        // console.log("current html ", event.target.innerHTML);

        const target = document.createTextNode("\u0001");
      this.document?.getSelection()?.getRangeAt(0).insertNode(target);
      this.currentIndex = event.target.innerHTML.indexOf("\u0001");
      // var position = contentEditableDiv.innerHTML.indexOf("\u0001");
      target.parentNode?.removeChild(target);

        // let difference = patienceDiff( a.split(""), b.split("") );

        this.open();
      }

      if (event.data === " ") {
        this.close();
      }




      console.log("comments this.lastInnerHTML: ", this.lastInnerHTML);
      console.log("comments this.currentInnerHTML: ", this.currentInnerHTML);

  
      if (event.data === "!") {
        // this.editableContent.nativeElement.innerHTML = '<span class="testingSpan">foobar</span> another';
  
        // myrenderer.setElementAttribute(elementRef.nativeElement, 'attributename', 'attributevalue');
  
        // let el = this.elRef.nativeElement;
      // this.renderer.setAttribute(this.editableContent.nativeElement, 'innerHTML', 
      //    `<span class="testingSpan">${this.editableContent.nativeElement.innerHTML}</span>`);
  
      // this.renderer.addClass(this.editableContent.nativeElement, 'makeBold');
      this.renderer.setProperty(this.editableContent?.nativeElement, 'innerHTML', 'Hello <span class="makeBold" data-paged-user="user-id-paged">@Surya</span> again');


      }

    });

    // this.listenForPlotChanges();
    // this.editableContent?.nativeElement.querySelector('editable-content')
    //                             .addEventListener('click', this.onClick.bind(this));
  }

  
  open() {
    this.popupOpen = true;
    // this.commentDataService.open();
  }

  close() {
    console.log("CLOSING TIME");
    this.popupOpen = false;
    // this.commentDataService.close();
  }

  selectUser(event: any) {
    this.close();
    console.log("comments $event: ", event);
    console.log("comments this.currentIndex: ", this.currentIndex);
    console.log("comments this.currentInnerHTML: ", this.currentInnerHTML);

    let innerHtmlParts = this.currentInnerHTML.split("@" + event.searchPhrase);

    this.currentInnerHTML = innerHtmlParts[0] + 
    '<span class="makeBold" data-selected-user-id="' + event.user.userID + '" data-comment-id="' + this.lastFakeCommentId + '">' + '@' + event.user.name + '</span>' + innerHtmlParts[1];

    this.renderer.setProperty(this.editableContent?.nativeElement, 'innerHTML', this.currentInnerHTML);

      // "user-id-paged">@Surya</span>' +
      // "@" + 
      // event.user.name + 
      // innerHtmlParts[1]
    


    console.log("comments innerHtmlParts: ", innerHtmlParts);
    console.log("comments this.currentInnerHTML: ", this.currentInnerHTML);

  }

  toggleButton() {

    this.editableContent?.nativeElement.focus();
    
    console.log("this.editableContent, ", this.editableContent);
    console.log("this.editableContent?.nativeElement.innerHTML, ", this.editableContent?.nativeElement.innerHTML);
    console.log("this.editableContent.nativeElement?.innerText, ", this.editableContent?.nativeElement.innerText);

    if (this.addCommentButton === false && this.newComment) {
      this.lastFakeCommentId++;


      let html = "<p><strong>This is in bold.</strong> This is not.</p>";

      // transform(html) {
      //   return this.sanitizer.bypassSecurityTrustHtml(html);
      // }

      // let thingy2 = this.sanitizer.bypassSecurityTrustHtml(html);

      // console.log("thingy2 , ", thingy2);


      this.comments.push({ id: this.lastFakeCommentId, userID: this.commentDataService.getCurrentUserId(), text: "<p><strong>This is in bold.</strong> This is not.</p>", date: new Date() });
      
      // this.comments.push({ id: this.lastFakeCommentId, userID: this.commentDataService.getCurrentUserId(), text: this.newComment, date: new Date() });
    }

    this.newComment = '';
    this.addCommentButton = !this.addCommentButton;
  }


  getSelectedText() {

    if (this.document.getSelection) { 
      console.log("1")   // all browsers, except IE before version 9
        let sel = this.document.getSelection();
        console.log("sel ", sel);
        console.log("sel.anchorNode ", sel?.anchorNode);
        console.log("sel.anchorNode.parentNode.childNodes ", sel?.anchorNode?.parentNode?.childNodes);
        console.log("sel.anchorNode.parentNode.childNodes ", sel?.anchorNode?.parentNode?.replaceChild);

        let parentNode = sel?.anchorNode?.parentNode;

        // SAVE!!! to replace nodes, maybe
        // let childNodes = sel?.anchorNode?.parentNode?.childNodes;

        // if (sel && sel.anchorNode && sel.anchorNode.parentNode && sel.anchorNode.parentNode.childNodes && sel.anchorNode.parentNode.childNodes.length) {

        //   let a = sel.anchorNode.parentNode.childNodes[1];
        //   let h = document.createElement('span')
        //   h.appendChild(document.createTextNode('new text'))
        //   parentNode?.replaceChild(h, a);
        // }

        
        // console.log("sel.anchorNode ", sel.anchorNode);

            // sel is a string in Firefox and Opera, 
            // and a selectionRange object in Google Chrome, Safari and IE from version 9
            // the alert method displays the result of the toString method of the passed object
        // alert(sel);
    } 
    else {
      console.log("2") 
        // if (this.document.selection) {   // Internet Explorer before version 9
        //     var textRange = this.document.selection.createRange();
        //     alert(textRange.text);
        // }
    }
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.unlistener();
  }




  



  

}
