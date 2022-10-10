const http = require("http");
const fs = require('fs');
const url = require('url');
const { insertar, consultar, editar, eliminar, transferir, consultaTran } = require('./consultas');

const port = 3000;

// Crear servidor
http
  .createServer(async (req, res) => {
    // Ruta raíz
    if (req.url == "/" && req.method == "GET") {
      res.setHeader('content-type', 'text/html;charset=utf8')
      const html = fs.readFileSync('index.html', 'utf8')
      res.statusCode = 200;
      res.end(html);

      // Ruta POST de url = '/usuario'
    } else if ((req.url == "/usuario" && req.method == "POST")) {
      try {
        let body = "";
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const usuario = (JSON.parse(body));
          console.log(usuario)
          const result = await insertar(usuario);
          res.statusCode = 201;
          res.end(JSON.stringify(result));
        });
      } catch (error) {
        showError(error, res);
      }

      // Ruta GET de url = '/usuarios'
    } else if (req.url == "/usuarios" && req.method == "GET") {
      try {
        const registros = await consultar();
        res.statusCode = 200;
        res.end(JSON.stringify(registros));
      } catch (error) {
        showError(error, res);
      }
      // Ruta PUT de url = '/usuario'
    }
    else if (req.url.startsWith('/usuario?') && req.method == "PUT") {

      const { id } = url.parse(req.url, true).query;

      try {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const datos = (JSON.parse(body));
          console.log('id', id);
          const respuesta = await editar(datos, id);
          res.statusCode = 201;
          res.end(JSON.stringify(respuesta));
        });
      } catch (error) {
        showError(error, res);
      }


    } else if (req.url.startsWith("/usuario?") && req.method == "DELETE") {
      try {
        const { id } = url.parse(req.url, true).query;
        const respuesta = await eliminar(id);
        res.statusCode = 200;
        res.end(JSON.stringify(respuesta));
      } catch (error) {
        showError(error, res);
      }
      // POST TRANSFERENCIA
    } else if (req.url == "/transferencia" && req.method == "POST") {
      try {
        let body = "";
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const datos = (JSON.parse(body));
          const historial = await transferir(datos);
          res.statusCode = 200;
          res.end(JSON.stringify(historial));
        });
      } catch (error) {
        showError(error, res);
      }
      // GET TRANSFERENCIAS
    } else if (req.url == "/transferencias" && req.method == "GET") {
      try {
        const registros = await consultaTran();
        res.statusCode = 200;
        // console.log('registros', registros);
        res.end(JSON.stringify(registros));
      } catch (error) {
        showError(error, res);
      }

    } else {
      res.statusCode = 404;
      const respuesta = 'Recurso no encontrado.';
      console.log(respuesta);
      res.end(respuesta);
    }
  })


  .listen(port, () => console.log('Conectado al puerto:', port));

const showError = (error, res) => {
  console.log(error.message);
  console.log(error.code);
  res.statusCode = 500;
  res.end(JSON.stringify(error));
}