import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import Excel from 'exceljs'
import axios from 'axios'
import ChtInstance from 'App/Models/ChtInstance'
import Service from 'App/Models/Service'
const { DateTime } = require('luxon')

export default class RenamesController {
  public async getTemplate({ response }: HttpContextContract) {
    const filePath = path.join(__dirname, '../../../workDir/xls/rename/contact/template.xlsx')
    response.download(filePath)
  }

  public async processInputs({ request, response, user }: HttpContextContract) {
    console.log('Renaming.................Running')
    const fileName = 'contacts.xlsx'
    const fileDir = path.join(__dirname, '../../../workDir/xls/rename/contact/')
    const filePath = path.join(fileDir, fileName)
    const { instanceId, desc } = request.body()

    //check upload file existance
    const renaming_file = request.file('renaming_file')
    if (!renaming_file) {
      response.status(500).json({ error: 'Fichier uploadé introuvable!' })
      return
    }

    await renaming_file.move(fileDir, { name: fileName, overwrite: true })

    //Fetch instance
    const instance = await ChtInstance.query().where('id', instanceId).first()
    if (!instance) {
      response.internalServerError({
        error: `Une erreur s'est produite lors de la tentative de récupération de l'instance identifiée comme ${instanceId}`,
      })
      return
    }

    const service = await Service.query()
      .where('name', 'renaming')
      .where('instance_id', instanceId)
      .where('running', true)
      .first()

    if (!!service) {
      response.forbidden({
        error: `Non autorisé, une tâche de changement de nom initiée par ${user.name} est déjà en cours d'exécution sur cette instance CHT`,
      })
      return
    }

    //Initiating current job
    const job = await user.related('services').create({
      name: 'renaming',
      desc: desc,
      running: true,
      startDate: DateTime.now(),
      instanceId: instance.id,
    })

    try {
      if (!job) {
        response.internalServerError({
          error: `Une erreur s'est produite lors de la tentative de lancement de la tâche de changement de nom`,
        })
        return
      }

      //Compose renaming instance url
      const protocole = instance.url.toString().substring(0, instance.url.toString().indexOf('/'))
      let baseUrl = instance.url
        .toString()
        .substring(instance.url.toString().indexOf('/'), instance.url.toString().length)
      baseUrl = baseUrl.substring(2, baseUrl.length)

      const findWorkBook = new Excel.Workbook()
      await findWorkBook.xlsx.readFile(filePath)
      const findWorksheet = findWorkBook.getWorksheet(1)
      for (let rowNumber = 2; rowNumber < findWorksheet.rowCount + 1; rowNumber++) {
        const row = findWorksheet.getRow(rowNumber)

        let isCompleted = false
        try {
          if (!!row.getCell(1).text) {
            const URL = `${protocole}//${baseUrl}/medic/${row.getCell(1).text}`

            const getContactRet = await axios.get(URL, {
              headers: {
                accept: 'application/json',
              },
            })

            if (!!getContactRet) {
              const currentContact = getContactRet.data
              if (!!currentContact.name) {
                currentContact.name = row.getCell(3).text
                const putContactRet = await axios.put(URL, currentContact)

                isCompleted = !!putContactRet
              }
            }
          }
        } catch (error) {}
        row.getCell(4).value = isCompleted ? 'Ok!' : 'NOk!'
        row.commit()
        job.progress = Math.ceil((100 * rowNumber) / findWorksheet.rowCount)
        job.save()
      }
      findWorkBook.xlsx.writeFile(filePath)
      response.download(filePath)

      job.endDate = DateTime.now()
      job.running = false
      job.protocole = 100
      job.save()
      console.log('Renaming.................Done')
    } catch (error) {
      job.delete()
      console.log('Renaming.................Failed')
      response.internalServerError({
        error: `Une erreur s'est produite lors du traitement du fichier`,
      })
      return
    }
  }
}
