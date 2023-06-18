import mongoose from 'mongoose'
import { IGenericMessage } from '../interfaces/error'

const handleDuplicateKeyError = (error: any) => {
  const errors: IGenericMessage[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: 'Duplicate Key Error',
    errorMessages: errors,
  }
}

export default handleDuplicateKeyError
