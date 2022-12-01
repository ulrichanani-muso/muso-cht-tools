import { CustomMessages } from '@ioc:Adonis/Core/Validator'

const defaultMessages = {
  required: 'Ce champ est requis',
  enum: 'La valeur de ce champ est invalide'
}

export { defaultMessages }

export default class BaseValidator {

  public messages: CustomMessages = defaultMessages
}
