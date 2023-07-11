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
  showCommentButton: boolean = true;
  newComment: string = "";
  lastFakeCommentId: number = 5;
  someField = "<p><strong>This is something in bold.</strong> This is not.</p>";
  // display$!: Observable<'open' | 'close'>;
  popupOpen: boolean = false;
  lastInnerHTML: string = '';


  private unlistener!: () => void;

  @ViewChild('editableContent') editableContent?: ElementRef;

  constructor(private commentDataService: CommentData, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  // @HostListener('input', ['$event']) input($event: InputEvent) {
  //   const target = $event.target as HTMLInputElement;
  //   const start = target.selectionStart;

  //   // target.value = target.value.toUpperCase();
  //   // target.setSelectionRange(start, start);

  //   console.log("host start: ", start);

  //   // this.onChange(target.value);
  // }

  please(event: any) {
    console.log("please event, ", event);
    console.log("please event.target, ", event.target);


    // let another = this.editableContent?.nativeElement;
    // console.log("another ", another);
    this.getSelectedText();

    // let hmmm1 = this.document.getElementById("testSibling");
    // let hmmm2 = this.document.getElementById("testSibling")?.previousSibling;
    // console.log("hmmm1 ", hmmm1);
    // console.log("hmmm2 ", hmmm2);
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


  ngAfterViewInit(): void {

      // let hmmm = this.getPreviousSiblings(this.editableContent?.nativeElement, 'shoe');
      // console.log("hmm ", hmmm);
    


  
     this.unlistener = this.renderer.listen(this.editableContent?.nativeElement, "input", event => {
      console.log(`I am detecting changes at ${event.pageX}, ${event.pageY} on Document!`);
      console.log("event: ", event);
      console.log("event.target.innerHTML: ", event.target.innerHTML);
      // console.log("event.target: ", event.target);
      // console.log("event.target.selectionStart: ", event.target.selectionStart);

      

      if (event.data === "@") {
        console.log("yeppers");
        console.log("event.target.selectionStart, ", event.target?.selectionStart);

        console.log("last html ", this.lastInnerHTML);
        console.log("current html ", event.target.innerHTML);

        // let difference = patienceDiff( a.split(""), b.split("") );

        this.open();
      } else {
        this.lastInnerHTML = event.target.innerHTML;
      }

      // this.lastInnerHTML = event.target.innerHTML;
  
      if (event.data === "!") {
        // this.editableContent.nativeElement.innerHTML = '<span class="testingSpan">foobar</span> another';
  
        // myrenderer.setElementAttribute(elementRef.nativeElement, 'attributename', 'attributevalue');
  
        // let el = this.elRef.nativeElement;
      // this.renderer.setAttribute(this.editableContent.nativeElement, 'innerHTML', 
      //    `<span class="testingSpan">${this.editableContent.nativeElement.innerHTML}</span>`);
  
      // this.renderer.addClass(this.editableContent.nativeElement, 'makeBold');
      this.renderer.setProperty(this.editableContent?.nativeElement, 'innerHTML', 'Hello <span class="makeBold" data-paged-user="user-id-paged">@Surya</span> again');
  
      // this.cdRef.detectChanges();
      }



      



      // const target = event.target as HTMLInputElement;
      // const start = target.selectionStart;

      // // console.log("start, ", start);
      // let okThen = this.editableContent?.nativeElement.querySelector('#editable-content');

      // console.log("okThen, ", okThen);






//       interesting:
//       outerHTML
// : 
// "<div contenteditable=\"\" id=\"editable-content\" onchange=\"doChange($event)\">Text @srya </div>"
// outerText
// : 
// "Text @srya"
    });

    // this.listenForPlotChanges();
    // this.editableContent?.nativeElement.querySelector('editable-content')
    //                             .addEventListener('click', this.onClick.bind(this));
  }



  


  ngOnInit(): void {

    // this.unlistener = this.renderer.listen(this.editableContent, "mousemove", event => {
    //   console.log(`I am detecting mousemove at ${event.pageX}, ${event.pageY} on Document!`);
    // });

   
    // cool, maybe handy
    // this.renderer[isDisabled ? 'addClass' : 'removeClass'](div, 'disabled');

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
  
    // this.subscription = this.commentDataService.getComments().subscribe(data => {
    //   console.log("data ", data)
    //   this.comments = data;
    // });
    
  }

  doFilter(event: any) {
    console.log("keyboard event ", event);
    if (event.key === "@") {
      console.log("yeppers");
      console.log("event.target.selectionStart, ", event.target?.selectionStart)
      this.open();
    }

    if (event.key === "!") {
      // this.editableContent.nativeElement.innerHTML = '<span class="testingSpan">foobar</span> another';

      // myrenderer.setElementAttribute(elementRef.nativeElement, 'attributename', 'attributevalue');

      // let el = this.elRef.nativeElement;
    // this.renderer.setAttribute(this.editableContent.nativeElement, 'innerHTML', 
    //    `<span class="testingSpan">${this.editableContent.nativeElement.innerHTML}</span>`);

    // this.renderer.addClass(this.editableContent.nativeElement, 'makeBold');
    this.renderer.setProperty(this.editableContent?.nativeElement, 'innerHTML', 'Hello <span class="makeBold" data-paged-user="user-id-paged">@Surya</span> again');

    // this.cdRef.detectChanges();
    }
  }




  doChange(event: any) {
    console.log("change event ", event)
  }

  open() {
    this.popupOpen = true;
    // this.commentDataService.open();
  }

  close() {
    this.popupOpen = false;
    // this.commentDataService.close();
  }

  toggleButton() {
    
    console.log("this.editableContent, ", this.editableContent);
    console.log("this.editableContent?.nativeElement.innerHTML, ", this.editableContent?.nativeElement.innerHTML);
    console.log("this.editableContent.nativeElement?.innerText, ", this.editableContent?.nativeElement.innerText);

    if (this.showCommentButton === false && this.newComment) {
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
    this.showCommentButton = !this.showCommentButton;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.unlistener();
  }




  



  

}
