/* async operation */
/*
import { Directive } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';

@Directive({
 selector: '[uniqueName]',
 providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueNameValidatorDirective, multi: true}]
})
export class UniqueNameValidatorDirective implements Validator {

 validate(c: FormControl): ValidationErrors {
   const message = {
     'uniqueName': {
       'message': 'The name is not unique'
     }
   };

   return new Promise(resolve => {
     setTimeout(() => {
       resolve(c.value === 'Existing' ? message : null);
     }, 1000);
   });
 }
}
*/
