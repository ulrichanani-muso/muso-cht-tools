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
const { spawnSync } = require('child_process')

export default class MovesController {
  public async getTemplate({ response }: HttpContextContract) {
    const filePath = path.join(__dirname, '../../../workDir/xls/move/contact/template.xlsx')
    response.download(filePath)
  }

  public async initiateMoving({ request, response, user }: HttpContextContract) {
    let jobInitialised: boolean = false

    console.log('%c Moving.................Initiating', 'color:orange; background-color:blue')
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
      job.progress_label = `Fichier d'entrée ouvert avec succès!`
      job.save()
      jobInitialised = true

      new Promise(async () => {
        try {
          const date = new Date()
          for (let rowNumber = 2; rowNumber < findWorksheet.rowCount + 1; rowNumber++) {
            console.groupCollapsed(`Contact:${rowNumber}`)
            console.time(`Contact:${rowNumber}`)
            const row = findWorksheet.getRow(rowNumber)
            let isCompleted = false
            if (!!row.getCell(1).text) {
              const URL = `${protocole}//${instance.username}:${
                instance.password
              }@${baseUrl}/medic/${row.getCell(1).text}`

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
                  console.log(`>Storing: ${row.getCell(1).text}`)
                  const CHT_COMMAND_STORE = `cht --force --url=${protocole}//${instance.username}:${
                    instance.password
                  }@${baseUrl}/ move-contacts -- --contacts=${row.getCell(1).text} --parent=${
                    row.getCell(3).text
                  } --docDirectoryPath=${workingDir}`
                  let childProcess = spawnSync(CHT_COMMAND_STORE, { shell: true })
                  console.log(`stdout: ${childProcess.stdout.toString()}`)

                  //Moving part 2...
                  console.log(`>Uploading: ${row.getCell(1).text}`)
                  const CHT_COMMAND_UPLOAD = `cht --force --url=${protocole}//${instance.username}:${instance.password}@${baseUrl}/ upload-docs -- --docDirectoryPath=${workingDir}`
                  childProcess = spawnSync(CHT_COMMAND_UPLOAD, { shell: true })
                  console.log(`stdout: ${childProcess.stdout.toString()}`)

                  //Operation logs backup after operation
                  const logFile = childProcess.stdout
                    .toString()
                    .match(/upload-docs\.\d+\.log\.json/)[0]
                  const logData = fs.readFileSync(logFile, 'utf8')
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
                    fs.unlinkSync(logFile)
                    console.error(`Removed log file ${logFile}`)
                  } catch (err) {
                    console.error(
                      `Error deleting log file ${logFile}: ${err.message}, moving next...`
                    )
                  }
                  isCompleted = true
                }
              } catch (error) {}
            }
            row.getCell(5).value = isCompleted ? 'Ok!' : 'NOk!'
            row.commit()

            //progress
            job.progress_label = `Fin de traitement de ${row.getCell(1).text} - ${
              row.getCell(2).text
            }!`
            job.progress = Math.ceil((100 * rowNumber) / findWorksheet.rowCount)
            job.save()
            console.timeEnd(`Contact:${rowNumber}`)
            console.groupEnd()
          }

          findWorkBook.xlsx.writeFile(filePath)
          job.endDate = DateTime.now()
          job.progress = 100
          job.progress_label = `Opération de deplacement finalisée!`
          job.running = false
          job.save()
          console.log('%c Moving.................Done', 'color:orange; background-color:blue')
        } catch (error) {
          job.running = false
          job.save()
          console.error('Moving.................Failed', error)
        }
      })

      response.status(200).send({
        instanceId: instanceId,
        jobId: job.id,
        msg: `Traitement du fichier initialisé avec succès!`,
      })
    } catch (error) {
      if (jobInitialised) {
        job.running = false
        job.save()
        console.error('Moving.................Failed', error)
      } else {
        console.error('Moving.................Failed', error)
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

      response.status(200).json({ progress: service.progress, label: service.progress_label })
    } catch (error) {
      response.internalServerError({
        error: `Une erreur s'est produite lors du téléchargement du fichier`,
      })
      return
    }
  }
}
