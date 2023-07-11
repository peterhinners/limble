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

  // getSearchPhrase(currentInnerHTML: string, currentIndex: number) {
  //   // currentIndex--;

  //   currentInnerHTML = currentInnerHTML.replace(/&nbsp;/g, ' ');

  //   let character = currentInnerHTML.charAt(currentIndex);
  //   console.log("filter current index: ", currentIndex);
  //   console.log("filter character: ", character);
  //   console.log("filter currentInnerHTML: ", currentInnerHTML);

  //   // var mySubString = currentInnerHTML.substring(
  //   //   currentIndex + 1, 
  //   //   currentInnerHTML.lastIndexOf(" ")
  //   // );

  //   let secondHalf = currentInnerHTML.substring(currentIndex);

  //   return secondHalf.split(" ")[0];
  // }

  public transform(value: User[], currentInnerHTML: string, currentIndex: number, searchPhrase: string) {
    
    // let searchPhrase = this.getSearchPhrase(currentInnerHTML, currentIndex);
    // console.log("filter searchPhrase: ", searchPhrase);

    return value.filter(user => {
      return user.name.toLowerCase().indexOf(searchPhrase.toLowerCase()) > -1;
    });

    // return result;

    // To get the substring BEFORE the nth occurence
// var tokens2 = currentInnerHTML.split(' ').slice(0, start),
// result2 = tokens2.join(delimiter); // this

    // let startingIndex = this.getStartingIndex(currentInnerHTML, lastInnerHTML);

    // console.log("startingIndex ", startingIndex);


 
    
    return value;



    // console.log("filter value, ", value);
    // console.log("newComment, ", newComment);
    // console.log("elem, ", elem);
    // console.log("elem.value, ", elem.value);
    // let initialPosition;
    // if (elem.selectionStart == null) return value;

    // if (elem. == '@') {
    //   initialPosition = elem.selectionStart;
    //   console.log("initialPosition, ", initialPosition);
    // }

    // if (initialPosition == null) {
    //   console.log("initialPosition is null");
    //   return value;
    // }

    

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