'use strict'

const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const XlsxTemplate = require('xlsx-template');
const Helpers = use('Helpers');
const Drive = use('Drive');
const User = use('App/Models/User')

class ExportController {
    async exportWord({ request, response }) {
        const content = fs.readFileSync(Helpers.publicPath('templates/individual_contract_labo.docx'), "binary");
        const zip = new PizZip(content);
        let doc = new Docxtemplater(zip);
        const users = await User.all();
        doc.setData({users: users.toJSON()});
        doc.render();

        const buf = doc.getZip().generate({type: 'nodebuffer'});
  
        await Drive.put('output.docx', buf)

        response.attachment(Helpers.tmpPath('output.docx'), 'output.docx')
    }

    async exportExcel({ request, response }) {
        const data =  fs.readFileSync(Helpers.publicPath('templates/don_dat_hang.xlsx'))
        var template = new XlsxTemplate(data);
        var sheetNumber = 1;
        const users = await User.all();
        template.substitute(sheetNumber, {users: users.toJSON()});
        const buf = template.generate({type: 'nodebuffer'});
        await Drive.put('output.xlsx', buf)
        response.attachment(Helpers.tmpPath('output.xlsx'), 'output.xlsx')
    }
}

module.exports = ExportController
