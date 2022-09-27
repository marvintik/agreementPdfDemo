import {Component, ElementRef, ViewChild} from '@angular/core';
import {SignatureComponent} from "./signature/signature.component";
import {MatDialog} from "@angular/material/dialog";
import jsPDF from 'jspdf';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'agreementPdfDemo';
  signature: any;

  firstName: string;
  lastName: string;
  isSing = false;
  signatureDate;
  @ViewChild('agreementDiv') content:ElementRef;

  constructor(private dialog: MatDialog) {
  }

  sign() {
    let dialogRef = this.dialog.open(SignatureComponent, this.getCustomDialogConfig(null, '800px', '520px'));

    dialogRef.afterClosed().subscribe(res => {
      if (res.data !== undefined) {
        this.signature = res.data;
        this.isSing = true;
        this.signatureDate = new Date();
      }
    });
  }

  private getCustomDialogConfig(data: any, width: string, height: string) {
    return {
      width: width,
      height: height,
      panelClass: 'customDialog',
      data: data,
    };
  }

  savePdf() {
    let content = this.content.nativeElement;

    var nativeElement = document.getElementById('contentAgr');
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4',
      putOnlyUsedFonts:true,
      hotfixes: ["px_scaling"],
    //  floatPrecision: "smart" // or "smart", default is 16
    });


    doc.html(nativeElement, {

      autoPaging: 'text',
      windowWidth: 750,
      width: 750,
      margin: [10, 10, 10, 20]
    }).then(() => doc.save("a4.pdf")
  );
  }
}
