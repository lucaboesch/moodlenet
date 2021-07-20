import { Database } from 'arangojs'
import { resolve } from 'path'
import semverValid from 'semver/functions/valid'
import { require_all_updaters } from './helpers'
import { initializeDB, stepDB, stepDBTo } from './lib'
import { Version } from './types'

const [arangoUrl, dbname, versionStepsDir, step, ctx_str] = process.argv.slice(2)

console.log(
  `start migration: 
    arangoUrl: ${arangoUrl}
    dbname: ${dbname}
    versionStepsDir: ${versionStepsDir}
    step: ${step}
    ctx: ${ctx_str}
`,
)

const ctx = JSON.parse(ctx_str || '_')
if (!(arangoUrl && dbname && versionStepsDir && step && ctx_str)) {
  throw new Error(`missing something:${JSON.stringify({ arangoUrl, dbname, versionStepsDir, step })}`)
}
const ladder = require_all_updaters({ dirname: resolve(process.cwd(), versionStepsDir) })

const db = new Database({ databaseName: dbname, url: arangoUrl })
if (['up', 'down'].includes(step)) {
  stepDB({ ladder, dir: step as 'up' | 'down' })({ db, ctx }).then(exit(db))
} else if (semverValid(step)) {
  stepDBTo({ ladder, targetVersion: step as Version })({ db, ctx }).then(exit(db))
} else if ('init' === step) {
  const sys_db = new Database({ url: arangoUrl })
  const forceDrop = process.env.FORCE_DROP_DBS === 'true'
  initializeDB({ dbname, actionOnDBExists: forceDrop ? 'drop' : 'abort', ladder })({ sys_db, ctx }).then(
    exit(db, sys_db),
  )
} else {
  exit(db)(`step shall be one of [up|down|init|targetVersion] found "${step}"`)
}

function exit(...dbs: Database[]) {
  return async (_: any) => {
    console.log(`exit with`, _)
    await Promise.all(dbs.map(db => db.close()))
    process.exit()
  }
}
