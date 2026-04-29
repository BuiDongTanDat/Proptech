import { Component } from '@angular/core';
import { Button } from '../../components/ui/button/button';
import { CustomInput } from "../../components/ui/custom-input/custom-input";

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
