import Fastify from "fastify";
import MySQL from "mysql";

const server = Fastify({
  logger: true,
});

const mysqlConfig = {
  host: "db",
  user: "root",
  password: "root",
  database: "desafio02",
};

const addNameAndQuery = (name) => {
  const connection = MySQL.createConnection(mysqlConfig);
  const namesList = [];

  connection.query(
    "CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))"
  );
  connection.query("INSERT INTO people(name) VALUES (?)", String(name));
  connection.query("SELECT * FROM desafio02.people", (error, results) => {
    if (error) throw error;
    results.forEach((result) => namesList.push(result.name));
  });

  connection.end();
  return namesList;
};
const list = addNameAndQuery("Valchan");

server.get("/", async (req, reply) => {
  reply.type("text/html").send(
    `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Full Cycle Rocks!</title>
    </head>
    <body>
      <h1>Full Cycle Rocks!</h1>
      <p>Lista de nomes cadastrados no banco de dados:</p>
      <ul>
        ${list.map((name) => `<li>${name}</li>`).join("")}
      </ul>
    </body>
    </html>
    `
  );
});

const start = async () => {
  try {
    await server.listen({ port: 3333, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
