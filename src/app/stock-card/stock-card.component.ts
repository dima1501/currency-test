import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import xml2js from 'xml2js';

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss']
})
export class StockCardComponent implements OnInit {

  DB = {
    apis: [
      'https://www.cbr-xml-daily.ru/daily_json.js',
      'https://www.cbr-xml-daily.ru/daily_utf8.xml'
    ],
    queryCurrency: 'EUR',
    data: []
  }

  ngOnInit() {
    this.getData();
    setTimeout(() => {
      this.getData();
    }, 10000);
  }

  async getData() {
    const database = this.DB;

    for await (const [i, source] of database.apis.entries()) {
      try {
        const response = await axios.get(source);
        const contentType = response.headers['content-type'];

        if (contentType.indexOf("text/xml") !== -1) {
          const parser = new xml2js.Parser();

          parser.parseString(response.data, (err, result) => {
            const valute = Object.values(result.ValCurs.Valute).filter((valute:any) => valute.CharCode == database.queryCurrency);
            database.data[i] = valute[0];
          });
        } else {
          database.data[i] = response.data.Valute[database.queryCurrency];
        }
      } catch(err) {
        database.data[i] = null;
        console.error(err);
      }
    }
  }
}
