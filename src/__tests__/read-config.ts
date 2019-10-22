import * as fs from 'fs'
import readConfig from '../read-config'

jest.spyOn(fs, 'readFileSync')

it('should read config', () => {
    const config = readConfig()
    console.log('config?!', config)
    expect(fs.readFileSync).toHaveBeenCalled()
})
