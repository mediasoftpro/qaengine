/* <input type="text" name="birthYear" #year="ngModel" ngModel required birthYear/> */
/* import { Directive } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator, ValidationErrors } from '@angular/forms';


@Directive({
 selector: '[birthYear]',
 providers: [{provide: NG_VALIDATORS, useExisting: BirthYearValidatorDirective, multi: true}]
})
export class BirthYearValidatorDirective implements Validator {

 validate(c: FormControl): ValidationErrors {
   const numValue = Number(c.value);
   const currentYear = new Date().getFullYear();
   const minYear = currentYear - 85;
   const maxYear = currentYear - 18;
   const isValid = !isNaN(numValue) && numValue >= minYear && numValue <= maxYear;
   const message = {
     'years': {
       'message': 'The year must be a valid number between ' + minYear + ' and ' + maxYear
     }
   };
   return isValid ? null : message;
 }
}
*/
