const fs = require('fs');
const pdfLib = require('pdf-lib');

// Some code taken from https://github.com/Hopding/pdf-lib README.md on 2019-09-04

// Load a PDFDocument from the existing PDF bytes
(async () => {
    try {
        // Filename is 3rd argument
        const fileName = process.argv[2];

        const data = fs.readFileSync(fileName);
        const entryDoc = await pdfLib.PDFDocument.load(data);
        const newDoc = await pdfLib.PDFDocument.create();
        const copiedPages = await newDoc.copyPages(entryDoc, entryDoc.getPageIndices());

        // Use first page for width and height (assumes they are all the same)
        const {width, height} = entryDoc.getPages()[0].getSize();
        const pageCount = entryDoc.getPageCount();
        for (let i = 0; i < pageCount; i++) {
            newDoc.addPage(copiedPages[i]);
            newDoc.addPage([width, height]);
        }
        const pdfFileWithEmptyPages = await newDoc.save();

        const pathName = fileName.slice(0, fileName.lastIndexOf('.')) + '-With-Space.pdf';
        fs.writeFileSync(pathName, pdfFileWithEmptyPages)
    } catch (err) {
        console.log(err);
    }

})();