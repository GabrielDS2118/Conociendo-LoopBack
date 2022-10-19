import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const generator = require('password-generator');
const cryptoJs = require('crypto-js');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  generate() {
    let clave = generator(8,false);
    return clave;
  }

  cryptoClave(clave:string) {
      let claveCifrada = cryptoJs.MD5(clave).toString();
      return claveCifrada;
  }
}
