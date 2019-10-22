import yaml from 'js-yaml'
import * as fs from 'fs'

function readConfig() {
    const CONFIG_FILE = '.gatekeeprrc'
    const raw_yaml = fs.readFileSync(CONFIG_FILE).toString()
    const config = yaml.load(raw_yaml)
    console.log('config!', config)
}

export default readConfig
