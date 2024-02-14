using chobani.db from '../db/schema';

service MyService {

    entity users as projection on db.users;
    entity StudentDetails as projection on db.student {Id};     // Returns a particular field.
    entity details  as select from db.student;                  // Returns all fields of student entity.
    entity SomeView  as SELECT * from db.student where Id=112;  // Returns complete record where the condition is satisfied.
    entity excelData as SELECT * from db.excelData;
    entity InvoiceDetails as select * from db.invoice; 
    entity invoiceLogs as select * from db.invoiceLogs;           // Returns all fields of invoice entity.      // Returns a single field.
    entity readData {
        Id:Integer;
        name:String;
    }
    entity writedata {
        Id:Integer;
        name:String;
    }    entity writedataUser{
        name:String;
        username:String;
        password:String;
    }
    entity userDetails{
        name:String;
        username:String;
        password:String;
    }
 

    action rejectIdoc(data : String) returns {Status : Integer};
    action userLogin(user : String, password:String) returns {response : String};
    action excelDataByInvoiceNumber (invoiceNumber : String) returns {response: String};
    action deleteByInvoiceNumber (invoiceNumber : String) returns {response: String};
    action sendToSap (invoiceNumber : String) returns {response: String};
    action excelUpload (excelData : String,invoiceDate:String,invoiceNumber:String,totalAmount:String) returns {response: String};
    action updateInvoice (invoiceNumber : String,newInvoiceGrossAmount:String,newFiscalYear:String) returns {response: String};
}

