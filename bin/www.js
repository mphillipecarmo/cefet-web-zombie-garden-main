#!/usr/bin/env node

// módulos da plataforma
import http from 'http'

// módulos da aplicação
import app from '../app.js'


const PORT = 3000
app.set('port', PORT)


const server = http.createServer(app)

server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)



function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requer privilégios de administrador`)
      process.exit(1)
      break

    case 'EADDRINUSE':
      console.error(`${bind} já está em uso`)
      process.exit(1)
      break

    default:
      throw error
  }
}


function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log(`Listening on ${bind}`)
}
