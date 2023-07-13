import { Pipe, PipeTransform} from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  public transform(value: User[], searchPhrase: string, filterMetaData: any) {
    
    let filteredUsers = value.filter(user => {
      return user.firstName.toLowerCase().indexOf(searchPhrase.toLowerCase()) > -1 || user.lastName.toLowerCase().indexOf(searchPhrase.toLowerCase()) > -1;
    });

    filterMetaData.filteredUsers = filteredUsers;

    return filteredUsers;
  }

}