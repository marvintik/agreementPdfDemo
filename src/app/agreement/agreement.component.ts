import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {

  effectiveDate: Date;
  @Input() name: string = '';
  @Input() signature: string;
  @Input() signedDate: Date;
  @Input() hideSignature: boolean;
  contractAddress: string;
  @Input() lastName: string;

  constructor() { }

  ngOnInit(): void {
    this.effectiveDate = this.signedDate || new Date();
  }

}
