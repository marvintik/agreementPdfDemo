import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SignaturePad} from "angular2-signaturepad";
import {FormControl} from "@angular/forms";
import {fontSize} from "html2canvas/dist/types/css/property-descriptors/font-size";

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements AfterViewInit, OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  selected = new FormControl(0);
  profile: string;
  height = 250
  width = 500

  signaturePadOptions: Object = {
    minWidth: 3,
    canvasWidth: this.width,
    canvasHeight: this.height,
  };
  selectedVariant: any;
  signatures: any[] = [];
  fontsName: string[] = ['Caveat Brush', 'Covered By Your Grace', 'Itim', 'Pacifico', 'Parisienne', 'Rock Salt'];
  selectedSignature: any;

  constructor(private dialogRef: MatDialogRef<SignatureComponent>, @Inject(MAT_DIALOG_DATA) public data: { name: string }) {
  }

  ngOnInit(): void {
  }


  async ngAfterViewInit() {
    this.signaturePad.clear();
    for (const fontName of this.fontsName) {
      let src = await this.generateDefaultImage(fontName)
      this.signatures.push(src);
    }
  }

  drawComplete() {
    let signature;
    if (this.selected.value == 0) {
      signature = this.signaturePad.toDataURL();
    } else if (this.selectedSignature !== undefined) {
      signature = this.selectedSignature
    } else {
      signature = '';
    }
    this.dialogRef.close({data: signature});
  }

  async generateDefaultImage(font: string) {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    canvas.width = 600;
    canvas.height = 200;
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    let fontSize = 36;
    if (this.data.name.length > 15 && this.data.name.length < 30) {
      fontSize = 32;
    }
    if (this.data.name.length > 30) {
      fontSize = 22;
    }
    let fontSpecific = `bold italic ${fontSize}px ${font}`;
    const fonts = await document.fonts.load(fontSpecific);
    context.font = fontSpecific;
    context.fillStyle = '#000000';
    context.fillText(this.data.name.toUpperCase(), 30, 100);
    const data = canvas.toDataURL();
    document.body.removeChild(canvas);
    return data;
  }

  clear() {
    this.signaturePad.clear();
  }

  selectTab($event: number) {
    this.selected.setValue($event);
  }

  changeValue(signature) {
    console.log(signature);
    signature.checked = !signature.checked;
  }
}
