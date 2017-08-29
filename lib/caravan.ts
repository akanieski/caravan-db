import * as processArgs from 'command-line-args'
 
const optionDefinitions = [
  { name: 'connection', alias: 'c', type: String }
]

let args = processArgs(optionDefinitions)

if (!args.connection) {
    throw new Error("Connection info is required!")
}

