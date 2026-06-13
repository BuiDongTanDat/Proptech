import { Component } from '@angular/core';
import { CustomInput } from '../../../components/ui/custom-input/custom-input';
import { Button } from '../../../components/ui/button/button';


@Component({
  selector: 'app-footer',
  imports: [
    Button,
    CustomInput
],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
