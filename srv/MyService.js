const express = require('express');
app = express()
const axios = require('axios');
const cds = require('@sap/cds')
const cors = require('cors'); // Add this line
const tough = require("tough-cookie");
const cookieJar = new tough.CookieJar();

app.use(cors()); // Add this line to enable CORS

class MyService extends cds.ApplicationService {

    async init() {
        const db = await cds.connect.to('db');

        const {student} = cds.entities ('chobani.db');
        const {users} = cds.entities('chobani.db');
        const {invoice} = cds.entities('chobani.db');
        const {excelData} = cds.entities('chobani.db');
        // console.log({excelData});

        this.on ('READ','readData', async (req) => {
            
                let results = await SELECT.from(student)
        console.log({excelData});

                console.log(JSON.stringify(results))
                return results
            })
        
        this.on('READ', 'userDetails', async (req) => {
            try {
                let results = await SELECT.from(users);
                console.log(results);
                return results;
            } catch (error) {
                console.error('Error executing READ operation:', error);
                // Handle or propagate the error appropriately based on your application's needs
                throw error;
            }
        });
      
        this.on ('userLogin', async (req) => {
                
                    var user = req.data.user;
                    var password = req.data.password;
                    
                    let record = await SELECT.from(users).where({userName : user});
                    console.log({record});
                    if(record.length){
                        console.log("record h");
                        if(record[0].password == password){
                            return {response:JSON.stringify({ message: JSON.stringify(record), status:200})}
                        }
                        else{
                            return {response:JSON.stringify({ message: "Wrong Password", status:400})};
                        }
                    }
                    else{
                        
                        return {response:JSON.stringify({ message: "Wrong Credentials", status:400})};
                    }
                });

        this.on ('excelDataByInvoiceNumber', async (req) => {
                
                    var invoiceNumber = req.data.invoiceNumber;
                    
                    let record = await SELECT.from(excelData).where({Supplierinvoice : invoiceNumber});
                    console.log({record});
                    if(record.length){
                            return {response:JSON.stringify({ message: JSON.stringify(record), status:200})}
                        }
                    else{
                        return {response:JSON.stringify({ message: "Data Not Found", status:400})};
                    }
                });
        this.on ('deleteByInvoiceNumber', async (req) => {
                
                    var invoiceNumber = req.data.invoiceNumber;
                    // console.log("deletByInvoiceNumber is called");
                    // console.log({invoiceNumber});
                    let record1 = await SELECT.from(excelData).where({Supplierinvoice : invoiceNumber});
                    console.log({record1});
                    let inrecord = await DELETE.from(invoice).where({invoiceNumber : invoiceNumber});
                    let record = await DELETE.from(excelData).where({Supplierinvoice : invoiceNumber});
                    console.log({record});
                    if(record.length){
                            return {response:JSON.stringify({ message: JSON.stringify(record), status:200})}
                        }
                    else{
                        return {response:JSON.stringify({ message: "Data Not Found", status:400})};
                    }
                });
                this.on('updateInvoice', async (req) => {
                    try {
                        const invoiceNumber = req.data.invoiceNumber;
                        const newInvoiceGrossAmount = req.data.newInvoiceGrossAmount;
                        const newFiscalYear = req.data.newFiscalYear;
                        
        
                        const updatedInvoice = await UPDATE(invoice)
                            .set({ invoiceAmount: newInvoiceGrossAmount })
                            .where({ invoiceNumber: invoiceNumber });
                            let record1 = await SELECT.from(excelData).where({Supplierinvoice : invoiceNumber});
                            console.log(record1);
                        
                        const updatedExcelData = await UPDATE(excelData)
                            .set({ Invoicegrossamount: newInvoiceGrossAmount, Fiscalyear: newFiscalYear })
                            .where({ Supplierinvoice: invoiceNumber });
                
                    
                        if ( updatedExcelData && updatedInvoice) {
                            return {
                                response: JSON.stringify({ message: "Invoice and Excel data updated successfully.", status: 200 })
                            };
                        } else {
                            return {
                                response: JSON.stringify({ message: "Data not found or no changes made.", status: 404 })
                            };
                        }
                    } catch (error) {
                        return {
                            response: JSON.stringify({ message: error.message, status: 500 })
                        };
                    }
                });
                
                
        
        this.on('excelUpload',async (req, res) => {
            var data = req.data.excelData;
            var excelDatas  = JSON.parse(data);
            var excelResponse = JSON.parse(data);
            var invoiceDate = req.data.invoiceDate;
            var invoiceNumber = req.data.invoiceNumber;
            var totalAmount = req.data.totalAmount;
            let invoiceData = await SELECT.from(invoice).where({invoiceNumber:invoiceNumber});
            // console.log({invoiceData});
            if(invoiceData.length){
                console.log("Invoice already exist.")
                return {response:JSON.stringify({ message: "Invoice already exist.", status:400})};
            }
            else{
                // console.log(excelDatas)
                let excelInvoiceChangeNum = false;
                let excelAmmount = 0;
                const fields = excelDatas.shift();
                excelDatas.forEach(async element => {
                    try{
                       if(element.length){
                        excelAmmount = excelAmmount + parseInt(element[8]);
                        if( element[0]!= invoiceNumber){
                            console.log(element[0],invoiceNumber)
                            excelInvoiceChangeNum = true;
                        } 
                        }
                    }
                    catch(e){
                        console.log(e);
                    }
                    
                });
                console.log(excelAmmount,totalAmount)
                const diff =(totalAmount)-parseInt(excelAmmount)
                console.log(typeof(diff),diff);
                console.log(((diff <= 1) && (diff>=0)))
                if(excelInvoiceChangeNum){
                    return {response:JSON.stringify({ message: "SupplierInvoice do not match.", status:400,excelResponse})};
                }
                else if(!((diff <= 1) && (diff>=-1))){
                    return {response:JSON.stringify({ message: "Invoicegrossamount do not match.", status:400,excelResponse})};
                }
                else{
                    await INSERT.into(invoice).columns('invoiceNumber','invoiceDate','invoiceAmount').values(invoiceNumber,invoiceDate,totalAmount) ;

                    excelDatas.forEach(async element => {
                        
                        try{
                            await INSERT.into(excelData).columns(fields).values(element) ;
                        }
                        catch(e){
                            console.log(e);
                        }
                        
                    });
                    return {response:JSON.stringify({ message: "Successfully Uploaded.", status:200,excelResponse})};
                }
                
            }
        });

        this.on('sendToSap', async(req)=>{
            console.log("req->data",req.data);
                const RauthHeader={
                    username:"RCHAUHAN1",
                    password:"@1234Rohan@"
                }
                const VauthItem ={
                    username:"VYadav",
                    password:"Vivek@12345"
                }

                const VreportUrlI = "https://71.251.192.136:44340/sap/opu/odata/SAP/ZCITEM_SRV/ZCITEMSet";
                const RreportUrlH = "https://71.251.192.136:44340/sap/opu/odata/sap/ZRCHOBANI_SRV_02/ZRCHOBANISet";
            
                const RsObject ={
                    "Supplierinvoice":"23",
                    "Fiscalyear":"2024",
                    "Companycode":"FG02A",
                    "Documentdate":"2023-01-02T10:10:20",
                    "Postingdate":"2004-10-13T11:11:18",
                    "Supplierinvoiceidbyinvcgparty":"AJ41KH6",
                    "Invoicingparty":"AJ41KH6",
                    "Documentcurrency":"IND",
                    "Invoicegrossamount":"20145",
                    "Duecalculationbasedate":"2022-08-22T13:14:20",
                    "Businessplace":"AJ01"
                }
                const VsObject ={
                    "Supplierinvoiceitem":11,
                    "Purchaseorder":"JHH",
                    "Purchaseorderitem":"74",
                    "Supplierinvoiceitemamoun":78,
                    "Documentcurrency":"IND",
                    "Taxcode":"R1"
                    }
                
            // Ye Rohan ka hai.
            try {
                const Rresponse = await axios.get(RreportUrlH, {
                  jar: cookieJar,
                  withCredentials: true,
                  RauthHeader,
                  headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': 'Fetch',
                  },
                });
                console.log(Rresponse);
                // if (Rresponse.status === 200) {
                //   let csrfToken = Rresponse.headers['x-csrf-token'];

                  
                //   axios
                //     .post(
                //         RreportUrlH,
                //         RsObject,
                //         {
                //             withCredentials: true,
                //             RauthHeader,
                //             origin: RreportUrlH,
                //             headers: {
                //                 "x-csrf-token": csrfToken,
                //                 'Content-Type': 'application/json',
                //             },
                //         }
                //     )
                //     .then(
                //         (response) => {
                //             console.log(response.data.d.to_Messages.results);
                //             return {response:JSON.stringify({ message: "Successfully sent to SAP.", status:200})};
                //         },
                //         (error) => {
                //             console.log(error)
                //             return {response:JSON.stringify({ message: error, status:400})};
                //         }
                //     );
                  
                  
                // } else {
                //   console.log('GET RESP ERROR ' + Rresponse.status);
                //   return {response:JSON.stringify({ message: "GET RESP ERROR ", status:Rresponse.status})};

                // }
            } catch (error) {
            console.log('GET CATCH ERROR', error);
                return {response:JSON.stringify({ message: error, status:500})};

            }

            //Ye Vivek Yadav ka hai
            // try {
            // const Vresponse = await axios.get(VreportUrlI, {
            //     // jar: cookieJar,
            //     withCredentials: true,
            //     VauthItem,
            //     headers: {
            //     'Content-Type': 'application/json',
            //     'x-csrf-token': 'Fetch',
            //     },
            // });
        
            // if (Vresponse.status === 200) {
            //     let csrfToken = Vresponse.headers['x-csrf-token'];

                
            //     axios
            //     .post(
            //         VreportUrlI,
            //         VsObject,
            //         {
            //             withCredentials: true,
            //             VauthItem,
            //             origin: RreportUrlH,
            //             headers: {
            //                 "x-csrf-token": csrfToken,
            //                 'Content-Type': 'application/json',
            //             },
            //         }
            //     )
            //     .then(
            //         (response) => {
            //         // resolve(response.data.d.to_Messages.results);
            //     return {response:JSON.stringify({ message: response.data.d.to_Messages.results, status:Vresponse.status})};
                    
                    
            //         },
            //         (error) => {
            //         // reject(error);
            //         console.log({error})

            //     return {response:JSON.stringify({ message: error, status:Vresponse.status})};

            //         }
            //     );
                
                
            // } else {
            //     console.log('GET RESP ERROR ' + Vresponse.status);
                
            //     return {response:JSON.stringify({ message: "Something went wrong.", status:Vresponse.status})};

            // }
            // } catch (error) {
            // console.log('GET CATCH ERROR', error);
            
            //     return {response:JSON.stringify({ message: "Something went wrong", status:500})};

            // }
        });


        await super.init();
    }
}
module.exports = {MyService}

// this.on ('READ','writedata', async (req) => {
        //     // var { data } = req.data
        //     // let approvedata = JSON.parse(data)
        //     let approvedata = [
        //         {
        //             "Id":121,
        //             "name":"Manish",
        //             "degree": "test",
        //             "salary": "500"
        //         },
        //         {
        //             "Id":122,
        //             "name":"Manish",
        //             "degree": "test",
        //             "salary": "500"
        //         },
        //         {
        //             "Id":123,
        //             "name":"Manish",
        //             "degree": "test",
        //             "salary": "500"
        //         }
        //         ]

        //         for(var i=0;i<approvedata.length;i++){

                    
        //             await INSERT.into(student).columns (
        //                 'Id', 'name', 'degree', 'salary'
        //             ) .values (
        //                 approvedata[i]['Id'], approvedata[i].name,approvedata[i]['degree'],approvedata[i]['salary']
        //             ) ;
        //             }

        //             let results =  await SELECT.from(student);
        //         return results
        //     })

    

        // this.on ('rejectIdoc', async (req) => {
        //             // var { data } = req.data
        //             // let approvedata = JSON.parse(data)
        //             let approvedata = [
        //                 {
        //                     "Id":116,
        //                     "name":"Manish",
        //                     "degree":"Bca",
        //                     "salary":500
        //                 },
        //                 {
        //                     "Id":117,
        //                     "name":"Manish",
        //                     "degree":"Bca",
        //                     "salary":500
        //                 },
        //                 {
        //                     "Id":118,
        //                     "name":"Manish",
        //                     "degree":"Bca",
        //                     "salary":500
        //                 }
        //                 ]
        //             for(var i=0;i<approvedata.length;i++){
        //                 console.log(approvedata[i]['Id']);

        //                 let so_header =  await SELECT.from(student);
        //                 await INSERT.into(student).columns (
        //                     'Id', 'name', 'degree', 'salary'
        //                 ) .values (
        //                     approvedata[i]['Id'], approvedata[i].name,approvedata[i]['degree'],approvedata[i]['salary']
        //                 ) ;
        //                 }
                
        //             return { Status: 201 };
        //         });
        
    
        // this.on ('READ','writedataUser', async (req) => {
        //     // var { data } = req.data
        //     // let approvedata = JSON.parse(data)
        //     let approvedata = [
        //         {
        //             "id":121,
        //             "name":"Manish",
        //             "userName": "test",
        //             "password": "500"
        //         },
        //         {
        //             "id":122,
        //             "name":"Manish",
        //             "userName": "test",
        //             "password": "500"
        //         }
        //         ]

        //         for(var i=0;i<approvedata.length;i++){    
        //             await INSERT.into(users).columns (
        //                 'Id', 'name', 'userName', 'password'
        //             ) .values (
        //                 approvedata[i]['id'], approvedata[i].name,approvedata[i]['userName'],approvedata[i]['password']
        //             ) ;
        //             }

        //             // let results =  await SELECT.from(student);
        //         return results
// })