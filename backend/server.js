const http = require('http')
const app = require('./app')

/**
 * @param {string | number} val
 */
const normalizePort = (val) => {
  const port = typeof val === 'string' ? parseInt(val, 10) : val

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

const port = normalizePort(process.env.PORT || 3000)
app.set('port', port)

/**
 * @param {string | import("net").AddressInfo} address
 */
const getBind = (address) =>
  typeof address === 'string' ? 'pipe ' + address : 'port :' + port

/**
 * @param {{ syscall: string; code: any; }} error
 */
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const address = server.address()
  const bind = getBind(address)
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
    default:
      throw error
  }
}

const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = getBind(address)
  console.log('Listening on ' + bind)
})

server.listen(port)
