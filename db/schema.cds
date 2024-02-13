namespace chobani.db;

entity users {
    key id:Integer;
    name: String(50);
    userName: String(50);
    password: String(50);
}
entity student{
    key Id:Integer;
    name:String(50);
    degree:String(30);
    salary:String(30);
    newsalary:String(30);
    oldsalary:String(30);
}

entity invoice{
    invoiceNumber:String(20);
    invoiceDate:Date;
    invoiceAmount:Integer;
}
entity excelData{
    Supplierinvoice:String(20);
    Fiscalyear:String(20);
    Companycode:String(20);
    Documentdate:String(20);
    Postingdate:String(20);
    Supplierinvoiceidbyinvcgparty:String(30);
    Invoicingparty:String(30);
    Documentcurrency:String(30);
    Invoicegrossamount:Integer;
    Duecalculationbasedate:String(20);
    Businessplace:String(30);
    Taxamount:String(30);
    Supplierinvoiceitem:String(30);
    Purchaseorder:String(30);
    Purchaseorderitem:String(30);
    SupplierInvoiceItemAmount:String(30);
    Taxcode:String(30);
}