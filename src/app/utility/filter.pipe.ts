import {ElementRef, Inject, Input, Pipe, PipeTransform} from '@angular/core';
import { User } from '../models/user';
import { DOCUMENT } from '@angular/common'; 
import { CommentsComponent } from '../components/comments/comments.component';
import { AfterViewInit } from '@angular/core';




@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  // document!: Document;

//   constructor(@Inject(DOCUMENT) document: Document) {
//     // document.getElementById('el');
//     this.document = document;
//  }

// elementRef!: ElementRef;
// @Input('myEasyBox') myComponent: EasyBoxComponent;

constructor(private elementRef: ElementRef) {}

ngAfterViewInit(): void {
  // this.el.nativeElement.attributes.collapsable = true;
  // let thingy = this.elementRef.nativeElement;
  // console.log('thingy , ', thingy);
}



  public transform(value: User[], newComment: string, elem: HTMLInputElement) {
    console.log("filter value, ", value);
    console.log("newComment, ", newComment);
    console.log("elem, ", elem);
    console.log("elem.value, ", elem.value);
    let initialPosition;
    if (elem.selectionStart == null) return value;

    // if (elem. == '@') {
    //   initialPosition = elem.selectionStart;
    //   console.log("initialPosition, ", initialPosition);
    // }

    if (initialPosition == null) {
      console.log("initialPosition is null");
      return value;
    }

    

    // let okThen = newComment.substring(initialPosition, newComment.length);
    // console.log("okThen , ", okThen);



    // let thingy = this.elementRef.nativeElement;
    // console.log('thingy please, ', thingy);
    // let elYoureLookingFor = this.host.;
    // let elYoureLookingFor = this.elementRef.nativeElement.innerHTML;
    // let elYoureLookingFor = this.elementRef.nativeElement.getElementById(id);
    // console.log("elYoureLookingFor, ", elYoureLookingFor);
    // let thingy = this.document.getElementById(id);
    // console.log("thingy, ", thingy);

    // this.document.getElementById(id)?.addEventListener('keyup', e => {
    //   console.log('Caret at: ', e)

    //   let thingy1 = e.target;
    //   console.log("thingy1 ", thingy1);
    //   // console.log('Caret at: ', e.target?.selectionStart)



    // })

    // let filteredItems = value.filter(employee => {
    //   if (selectedDepartment === 'All Departments') return true;
    //   return employee.department === selectedDepartment;
    // });

    // filterMetadata.count = filteredItems.length;
  
    // return filteredItems;

    return value;
  }

  
}