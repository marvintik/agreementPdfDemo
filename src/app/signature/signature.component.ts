import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SignaturePad} from "angular2-signaturepad";

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements AfterViewInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signaturePadOptions: Object = {
    minWidth: 3,
    canvasWidth: 650,
    canvasHeight: 350,
  };

  constructor(private dialogRef: MatDialogRef<SignatureComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {}

  ngAfterViewInit() {
    this.signaturePad.clear();
  }

  drawComplete() {
    const signature = this.signaturePad.toDataURL();
    this.dialogRef.close({ data: signature });
  }

  clear() {
    this.signaturePad.clear();
  }
}
