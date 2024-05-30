import * as fileSystem from 'fs'
import fs from 'fs/promises'
import path from 'path'

// import {
//   BACKEND_URL,
//   RDP_BASE_FOLDER,
//   SSH_BASE_FOLDER,
//   VNC_BASE_FOLDER,
//   WEB_BASE_FOLDER,
// } from '@/env'
// import logger from '@/logger'
// import { parseCommands } from '@/utils/proxy-parser'
// import { sleep } from '@/utils/utils'

// import { RemoteAccessStatus } from '../backend/dtos/api.dto'
// import RecordFileUploaded from '../backend/events/recordFileUploaded.event'
// import RemoteSessionAllFilesUploadedEvent from '../backend/events/remoteSessionAllFilesUploaded.event'

// import type { Backend } from '../backend/service'

export interface UploadTask {
  remoteSessionId: string
  filePath: string // the file to be uploaded.
  isNeedDelete: boolean
  runTimeAt: Date
}

export interface IProxyUploader {
  onRecordCreated(sessionId: string, filePath: string): void
  onRecordStopped(sessionId: string, baseFolderPath: string): void
  footage(
    sessionId: string,
    startTime: Date,
    endTime: Date,
    commands: string[],
  ): void
}

export class Uploader implements IProxyUploader {
  // eslint-disable-next-line no-use-before-define
  private tasks: UploadTask[] = []
  private running = false
  private fileFolderPrefix = './data'

  private remoteSessionFiles: Map<string, number> = new Map()
  private waitingUploadResult: Map<string, UploadTask> = new Map()

  constructor() {
    this.start() // Start the background processing of session recordings.
    // this.reNumber('')
  }

  public async start() {
    // while (true) {
    //   await this.sleep(30000)
    //   console.log('啟動了', new Date())
    //   await this.reUpload('')
    //   // throw new Error('Method not implemented.')
    // }
    await this.reUpload('')
    // await this.onRecordStopped('clwrg4g41002u2cqqhwrp957z', './data/ssh-proxy')
    this.onRecordCreated(
      'clwrg4g41002u2cqqhwrp957z',
      './data/ssh-proxy/clwrg4g41002u2cqqhwrp957z-1.cast',
    )
  }

  public footage(
    sessionId: string,
    startTime: Date,
    endTime: Date,
    commands: string[],
  ): void {
    throw new Error('Method not implemented.')
  }

  public async onRecordStopped(
    sessionId: string,
    folderPath: string,
  ): Promise<void> {
    const fileNames = await fs.readdir(folderPath)

    console.log('fileNames : ', fileNames)
    const filterFileNames = fileNames.filter((fileName) =>
      fileName.endsWith('.castlist'),
    )
    for (const fileName of filterFileNames) {
      const filePath = path.join(folderPath, fileName)
      this.uploadByPresignedUrl(sessionId, filePath)
      this.emitRecordFileUploaded(sessionId, filePath)
    }
  }

  public onRecordCreated(sessionId: string, filePath: string): void {
    this.uploadByPresignedUrl(sessionId, filePath)
    this.emitRecordFileUploaded(sessionId, filePath)
  }

  private async reUpload(filePath: string): Promise<void> {
    const fullPath = path.join(this.fileFolderPrefix, filePath)
    try {
      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        const files = await fs.readdir(fullPath)
        if (files.length === 0) {
          return
        }
        for (const file of files) {
          // console.log('個別檔案', file)
          await this.reUpload(path.join(filePath, file))
        }
      } else {
        // console.log('File:', fullPath)
        this.upload(fullPath)
      }
    } catch (err) {
      console.error('Error accessing file/directory:', err)
    }
  }

  private upload(filePath: string): void {
    if (filePath.endsWith('cast') || filePath.endsWith('castlist')) {
      if (filePath.endsWith('cast')) {
        const fileName = path.basename(filePath)
        const regex = /-\d+\.cast$/
        // 檢測檔案有沒有不符合規則 => xxx-1.cast 是對的， xxx.cast 是錯的
        if (regex.test(fileName)) {
          console.log('upload => ', filePath)
        } else {
          // 發現有 xxx.cast 的檔案名稱
          this.reNumber(filePath)
        }
      } else {
        console.log('upload =>', filePath)
      }
    }
  }

  private async reNumber(filePath: string) {
    console.log('啟動編碼流程，檔案為: ', filePath)
    const dir = path.parse(filePath).dir // 取出資料夾路徑
    const sessionId = path.parse(filePath).name // 取出檔案名稱前面的 sessionId
    const listFile = path.join(dir, sessionId + '.castlist')
    const createTime = (await fs.stat(filePath)).birthtime.getTime()
    const updateTime = (await fs.stat(filePath)).mtime.getTime()
    const duration = (updateTime - createTime) / 1000
    console.log('duration : ', duration)

    let newfilePath = ''
    try {
      const data = fileSystem.readFileSync(listFile, 'utf8')
      const keyword = '.cast"'

      if (data.lastIndexOf(keyword) !== -1) {
        console.log(
          `找到了關鍵字 '${keyword}'`,
          'index :',
          data.lastIndexOf(keyword),
        )
        const newNumber = Number(data[data.lastIndexOf(keyword) - 1]) + 1
        newfilePath = path.join(
          dir,
          sessionId + '-' + String(newNumber) + '.cast',
        )
      } else {
        console.log(`未找到關鍵字 '${keyword}'`)
        newfilePath = path.join(dir, sessionId + '-1.cast')
      }
    } catch (err) {
      console.error('讀取檔案時發生錯誤：', err)
    }
    console.log('newfilePath: ', newfilePath)
    fs.rename(filePath, newfilePath)
    this.uploadByPresignedUrl(sessionId, newfilePath)
    this.emitRecordFileUploaded(sessionId, newfilePath)

    // 改寫 castlist
    const newFilename = path.basename(newfilePath)
    const jsonString = `\n["file", "${newFilename}", ${String(duration)}]\n`
    this.writeCastlist(listFile, jsonString)
  }

  private writeCastlist(filePath: string, content: string) {
    try {
      let data = fileSystem.readFileSync(filePath, 'utf8')
      console.log('data : ', data, typeof data)
      data += content
      fileSystem.writeFileSync(filePath, data, 'utf8')

      console.log('資料已成功新增到檔案中。')
    } catch (err) {
      console.error('處理檔案時發生錯誤:', err)
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // @Override
  public async uploadByPresignedUrl(
    sessionId: string,
    filePath: string,
  ): Promise<void> {
    console.log('上傳囉', filePath)
    // await this.backend.uploadByPresignedUrl(sessionId, filePath)
  }

  // @Override
  public emitRecordFileUploaded(sessionId: string, fileName: string): void {
    console.log('上傳 event 到後端囉', fileName)

    // this.backend.emitEvent(new RecordFileUploaded(BACKEND_URL, sessionId, fileName));
  }
}
