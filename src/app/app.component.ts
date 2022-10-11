import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SignatureComponent} from "./signature/signature.component";
import {MatDialog} from "@angular/material/dialog";
import {PDFDocument} from 'pdf-lib';
import {PDFDocumentProxy} from "ng2-pdf-viewer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'agreementPdfDemo';
  signature: any;

  firstName: string;
  lastName: string;
  isSing = false;
  signatureDate;
  @ViewChild('agreementDiv') content: ElementRef;
  showPdf: boolean = true;
  pdfTemplateSource = "/assets/templates/CSOrderForms.pdf";
  pdfSource: any;
  pdfDoc: PDFDocument;
  p: any[];

  constructor(private dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    this.pdfSource = await this.modifyPdf();
  }

  sign() {
    let dialogRef = this.dialog.open(SignatureComponent, this.getCustomDialogConfig(null, '800px', '520px'));

    dialogRef.afterClosed().subscribe(res => {
      if (res.data !== undefined) {
        this.signature = res.data;
        this.addSignatureToPdf(res.data);
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

  public async modifyPdf() {
    const existingPdfBytes = await fetch(this.pdfTemplateSource).then(res => res.arrayBuffer())
    const termsOfUsePdfBytes = await fetch("/assets/templates/termsOfUseExample.pdf").then(res => res.arrayBuffer());
    const termsOfUse = await PDFDocument.load(termsOfUsePdfBytes)
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const {width, height} = firstPage.getSize()

    const form = pdfDoc.getForm();
    form.getTextField("Campaign Name").setText("Campaign Title");
    form.getTextField("Order Number").setText("#1");
    let date = new Date();
    form.getTextField("Current Date").setText(`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`);
    form.getTextField("VendorContact").setText("John Doe");
    form.getTextField("BuyerContact").setText("John Doe");

    form.getTextField("VendorCompanyName").setText("Vendor Company Name");
    form.getTextField("BuyerCompanyName").setText("Buyer Company Name");

    form.getTextField("VendorAddress").setText("Empire State Building, New York 10001");
    form.getTextField("VendorAddress2").setText("Empire State Building, New York 10001");
    form.getTextField("VendorLocation").setText("New York, NY 10001, USA");

    form.getTextField("BuyerAddress").setText("The White House,1600 Pennsylvania Ave NW");
    form.getTextField("BuyerAddress2").setText("The White House,1600 Pennsylvania Ave NW");
    form.getTextField("BuyerLocation").setText("Washington, DC 20500, USA");

    form.getTextField("VendorPhone").setText("+1111111111111");
    form.getTextField("BuyerPhone").setText("+22222222222222");

    form.getTextField("VendorEmailAddress").setText("empire.state@mail.com");
    form.getTextField("BuyerEmailAddress").setText("vhite.house@mail.com");
    date.setDate(date.getDate() + 30);
    form.getTextField("DeliveryDate").setText(`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`);
    form.getTextField("CodeRow1").setText("1");
    form.getTextField("DescriptionRow1").setText("Product Title");
    form.getTextField("QuantityRow1").setText("10");
    form.getTextField("Unit PriceRow1").setText("500$")

    form.getTextField("AmountRow1").setText("5000$")

    form.getTextField("Subtotal").setText("5000$");
    form.getTextField("Shipping").setText("15$");
    form.getTextField("TotalAmount").setText("5015$");

    console.log(termsOfUse.getPages().length);
    const termsOfUsePages = await pdfDoc.copyPages(termsOfUse, [0, termsOfUse.getPages().length - 1]);

    for (let page of termsOfUsePages) {
      pdfDoc.addPage(page);
    }
    const pdfBytes = await pdfDoc.save();
    this.pdfDoc = pdfDoc;
    return pdfBytes.buffer;
  }

  async savePdf() {
    const a = document.createElement('a')
    this.pdfDoc.getForm().flatten();
    a.href = await this.pdfDoc.saveAsBase64({dataUri: true});
    a.download = "demoOrder.pdf";
    a.click();
  }

  private async addSignatureToPdf(signature) {
    let signField = this.pdfDoc.getForm().getButton("SignHere");
    const signatureImage = await this.pdfDoc.embedPng(signature)

    signField.setImage(signatureImage);
    const pdfBytes = await this.pdfDoc.save();
    this.pdfSource = await pdfBytes.buffer;
  }

  callBackFn($event: PDFDocumentProxy) {
    console.log($event);
  }
}
