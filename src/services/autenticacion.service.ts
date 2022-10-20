import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Llaves } from '../config/llaves';
import { Persona } from '../models';
import { PersonaRepository } from '../repositories';

const generator = require('password-generator');
const cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');


@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    /* Add @inject to inject parameters */
      @repository(PersonaRepository)
      public personaRepository: PersonaRepository
    ) {}

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

  identifyPerson(user: string, password: string){
    try{

        //Buscar persona con el usuario y correo proporcionado
        let person = this.personaRepository.findOne({ where: {correo: user, clave: password}});
        if(person) {
          return person
        }

        return false
    }

    catch{
      return false
    }
  }

  generateToken(person: Persona){
    let token = jwt.sign(
      {
        data: {
            id: person.id,
            correo: person.correo,
            nombre: person.nombres + ' ' + person.apellidos
        }
      }, 
      Llaves.claveJWT
    )

    return token
  }

  validateToken(token: string){
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    }
    catch {
      return false;
    }
  }


}
