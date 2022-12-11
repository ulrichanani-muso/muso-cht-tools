import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import Excel from 'exceljs'
import axios from 'axios'
import { AxiosRequestConfig, AxiosPromise } from 'axios'
import ChtInstance from 'App/Models/ChtInstance'
import Service from 'App/Models/Service'
import Doc from 'App/Models/Doc'
const { DateTime } = require('luxon')

export default class RenamesController {
  public async getTemplate({ response }: HttpContextContract) {
    const filePath = path.join(__dirname, '../../../workDir/xls/rename/contact/template.xlsx')
    response.download(filePath)
    response.status(200).json({ msg: 'Fichier téléchargé avec succès!' })
  }

  public async initiateRenaming({ request, response, user }: HttpContextContract) {
    let jobInitialised: boolean = false

    console.log('Renaming.................Initiating')
    const { instanceId, desc } = request.body()

    //check upload file existance
    const renaming_file = request.file('renaming_file')
    if (!renaming_file) {
      response.status(500).json({ error: 'Fichier uploadé introuvable!' })
      return
    }
    const filePath = renaming_file.tmpPath + ''

    //Fetch instance
    const instance = await ChtInstance.query().where('id', instanceId).first()
    if (!instance) {
      response.internalServerError({
        error: `Une erreur s'est produite lors de la tentative de récupération de l'instance identifiée comme ${instanceId}`,
      })
      return
    }

    //Checking instance status
    try {
      await axios.get(instance.url)
    } catch (error) {
      response.notFound({
        error: `L'instance '${instance.name}' n'est pas disponible!`,
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
      filePath: filePath,
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
      job.progress = 0
      job.save()
      response.status(200).send({
        instanceId: instanceId,
        jobId: job.id,
        msg: `Traitement du fichier initialisé avec succès!`,
      })
      jobInitialised = true

      for (let rowNumber = 2; rowNumber < findWorksheet.rowCount + 1; rowNumber++) {
        const row = findWorksheet.getRow(rowNumber)
        let isCompleted = false

        if (!!row.getCell(1).text) {
          const URL = `${protocole}//${instance.username}:${instance.password}@${baseUrl}/medic/${
            row.getCell(1).text
          }`

          let getContactRet: AxiosRequestConfig
          try {
            getContactRet = await axios.get(URL, {
              headers: {
                accept: 'application/json',
              },
            })

            const currentContact = getContactRet.data
            if (!!currentContact.name) {
              //backup before operation
              const doc = new Doc()
              await doc.fill({
                key: currentContact._id,
                value: currentContact,
                service_id: job.id,
              })
              doc.service = job
              doc.save()

              if (!!doc) {
                currentContact.name = row.getCell(3).text
                const putContactRet = await axios.put(URL, currentContact)
                isCompleted = !!putContactRet
              }
            }
          } catch (error) {}
        }
        row.getCell(4).value = isCompleted ? 'Ok!' : 'NOk!'
        row.commit()

        //progress
        job.progress = Math.ceil((100 * rowNumber) / findWorksheet.rowCount)
        job.save()
      }

      findWorkBook.xlsx.writeFile(filePath)
      job.endDate = DateTime.now()
      job.pro = 100
      job.running = false
      job.save()

      console.log('Renaming.................Done')
    } catch (error) {
      if (jobInitialised) {
        job.running = false
        job.save()
        console.log('Renaming.................Failed')
      } else {
        job.delete()
        response.internalServerError({
          error: `Une erreur s'est produite lors du traitement du fichier`,
        })
      }
    }
  }

  public async getRenamingResult({ request, response, user }: HttpContextContract) {
    try {
      const { instanceId, jobId } = request.params()

      //Fetch instance
      const instance = await ChtInstance.query().where('id', instanceId).first()
      if (!instance) {
        response.internalServerError({
          error: `Une erreur s'est produite lors de la tentative de récupération de l'instance identifiée comme ${instanceId}`,
        })
        return
      }

      const service = await Service.query().where('id', jobId).first()

      if (!service) {
        response.forbidden({
          error: `Une erreur s'est produite lors de la tentative de récupération de l'activité identifiée comme ${jobId}`,
        })
        return
      }

      if (service.running) {
        response.forbidden({
          error: `Non autorisé, la tâche de renommage est toujours en cours d'exécution sur cette instance CHT`,
        })
        return
      }

      response.download(service.filePath)
    } catch (error) {
      console.log(error);
      
      response.internalServerError({
        error: `Une erreur s'est produite lors du téléchargement du fichier`,
      })
      return
    }
  }

  public async getRenamingProgress({ request, response, user }: HttpContextContract) {
    try {
      const { jobId } = request.params()
      const service = await Service.query().where('id', jobId).first()

      if (!service) {
        response.forbidden({
          error: `Une erreur s'est produite lors de la tentative de récupération de l'activité identifiée comme ${jobId}`,
        })
        return
      }

      response.status(200).json({progress:service.progress});
    } catch (error) {
      response.internalServerError({
        error: `Une erreur s'est produite lors du téléchargement du fichier`,
      })
      return
    }
  }
}
