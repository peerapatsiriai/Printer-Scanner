const { print } = require("pdf-to-printer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3205;

app.use(cors());

function generatePDF(data) {
  const doc = new PDFDocument({
    size: [150, 200], // Set the PDF size to 58mm width and 200mm height
    margin: 0, // No margin
  });

  doc.pipe(fs.createWriteStream("bill.pdf"));
  doc.fontSize(12).text(`Item: ${data.item_name}\n--------------------------\nPrice: ${data.item_price} $`, { align: "center" });
  // New line for the barcode
  doc.moveDown();
  
  // Add the barcode image to the PDF
  // doc.image("./qr.png", { width: 50, align: "center" });
  doc.end();
}


app.get('/printbill', (req, res) => {
  const data = req.query; // Access the data sent from the frontend
    // Generate the bill-sized PDF and then print it
    generatePDF(data);
    print("bill.pdf").then(() => {
    console.log("Successfully printed");
    }).catch((error) => {
    console.error("Error while printing:", error);
    });
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});