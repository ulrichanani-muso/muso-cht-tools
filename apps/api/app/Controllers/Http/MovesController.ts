// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import Excel from 'exceljs'
import axios from 'axios'
import fs from 'fs'
import { AxiosRequestConfig, AxiosPromise } from 'axios'
import ChtInstance from 'App/Models/ChtInstance'
import Service from 'App/Models/Service'
import Doc from 'App/Models/Doc'
const { DateTime } = require('luxon')
const { execSync } = require('child_process')

export default class MovesController {
  public async getTemplate({ response }: HttpContextContract) {
    const filePath = path.join(__dirname, '../../../workDir/xls/contact/move/template.xlsx')
    response.download(filePath)
  }

  public async initiateMoving({ request, response, user }: HttpContextContract) {
    let jobInitialised: boolean = false

    console.log('Moving.................Initiating')
    const { instanceId, desc } = request.body()

    //check upload file existance
    const moving_file = request.file('moving_file')
    if (!moving_file) {
      response.status(500).json({ error: 'Fichier uploadé introuvable!' })
      return
    }
    const filePath = moving_file.tmpPath + ''

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
      .where('name', 'moving')
      .where('instance_id', instanceId)
      .where('running', true)
      .first()

    if (!!service) {
      response.forbidden({
        error: `Non autorisé, une tâche de deplacement de contact initiée par ${user.name} est déjà en cours d'exécution sur cette instance CHT`,
      })
      return
    }

    //Initiating current job
    const job = await user.related('services').create({
      name: 'moving',
      desc: desc,
      running: true,
      filePath: filePath,
      startDate: DateTime.now(),
      instanceId: instance.id,
    })

    try {
      if (!job) {
        response.internalServerError({
          error: `Une erreur s'est produite lors de la tentative de lancement de la tâche de deplacement de contact`,
        })
        return
      }

      //Compose moving instance url
      const protocole = instance.url.toString().substring(0, instance.url.toString().indexOf('/'))
      let baseUrl = instance.url
        .toString()
        .substring(instance.url.toString().indexOf('/'), instance.url.toString().length)
      baseUrl = baseUrl.substring(2, baseUrl.length)

      const findWorkBook = new Excel.Workbook()
      await findWorkBook.xlsx.readFile(filePath)
      const findWorksheet = findWorkBook.getWorksheet(1)
      job.progress = 0
      job.progress_label=`Fichier d'entrée ouvert avec succès!`

      job.save()
      response.status(200).send({
        instanceId: instanceId,
        jobId: job.id,
        msg: `Traitement du fichier initialisé avec succès!`,
      })
      jobInitialised = true

      const date = new Date()
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
              const workingDir = `${path.dirname(filePath)}/${date
                .toISOString()
                .replace(/[^a-z0-9]/gi, '_')}/${instanceId}/${job.id}/move_contact/${
                row.getCell(1).text
              }`
              fs.mkdirSync(workingDir, { recursive: true })

              //Moving part 1...
              console.error(`>Storing: ${row.getCell(1).text}`)
              const CHT_COMMAND_STORE = `cht --force --url=${protocole}//${instance.username}:${
                instance.password
              }@${baseUrl}/ move-contacts -- --contacts=${row.getCell(1).text} --parent=${
                row.getCell(3).text
              } --docDirectoryPath=${workingDir}`
              let childProcess = execSync(CHT_COMMAND_STORE)
              console.log(`stdout: ${childProcess.toString()}`)

              //Moving part 2...
              console.error(`>Uploading: ${row.getCell(1).text}`)
              const CHT_COMMAND_UPLOAD = `cht --force --url=${protocole}//${instance.username}:${instance.password}@${baseUrl}/ upload-docs -- --docDirectoryPath=${workingDir}`
              childProcess = execSync(CHT_COMMAND_UPLOAD)
              console.log(`stdout: ${childProcess.toString()}`)

              //Operation logs backup after operation
              const logFile= childProcess.toString().match(/upload-docs\.\d+\.log\.json/)[0]
              const logData = fs.readFileSync(logFile, 'utf8');
              const doc = new Doc()
              await doc.fill({
                key: currentContact._id,
                value: logData,
                service_id: job.id,
              })
              doc.service = job
              doc.save() 
              //remove logfile 
              try {
                fs.unlinkSync(logFile);
              } catch (err) {
                console.error(`Error deleting log file ${logFile}: ${err.message}, moving next...`);
              }
              isCompleted = true
            }
          } catch (error) {}
        }
        row.getCell(5).value = isCompleted ? 'Ok!' : 'NOk!'
        row.commit()

        //progress
        job.progress_label=`Fin de traitement de ${row.getCell(1).text} - ${row.getCell(2).text}!`
        job.progress = Math.ceil((100 * rowNumber) / findWorksheet.rowCount)
        job.save()
      }

      findWorkBook.xlsx.writeFile(filePath)
      job.endDate = DateTime.now()
      job.progress = 100
      job.progress_label=`Opération de deplacement finalisée!`
      job.running = false
      job.save()

      console.log('Moving.................Done')
    } catch (error) {
      if (jobInitialised) {
        job.running = false
        job.save()
        console.log('Moving.................Failed', error)
      } else {
        console.log('Moving.................Failed', error)
        job.delete()
        response.internalServerError({
          error: `Une erreur s'est produite lors du traitement du fichier`,
        })
      }
    }
  }

  public async getMovingResult({ request, response, user }: HttpContextContract) {
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
          error: `Non autorisé, la tâche de deplacement est toujours en cours d'exécution sur cette instance CHT`,
        })
        return
      }

      response.download(service.filePath)
    } catch (error) {
      console.log(error)

      response.internalServerError({
        error: `Une erreur s'est produite lors du téléchargement du fichier`,
      })
      return
    }
  }

  public async getMovingProgress({ request, response, user }: HttpContextContract) {
    try {
      const { jobId } = request.params()
      const service = await Service.query().where('id', jobId).first()

      if (!service) {
        response.forbidden({
          error: `Une erreur s'est produite lors de la tentative de récupération de l'activité identifiée comme ${jobId}`,
        })
        return
      }

      response.status(200).json({ progress: service.progress, label: service.progress_label})
    } catch (error) {
      response.internalServerError({
        error: `Une erreur s'est produite lors du téléchargement du fichier`,
      })
      return
    }
  }
}
