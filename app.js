const express = require("express"); // Importar
const app = express(); // Crear el webservice

app.use(express.json());
app.use("/", express.static("public"));
//app.use(cors());

const users = [];

let _id = 0;

/* 
https://misitio.com/

get -> parametros ? / solicitar users
post -> parametros / body json / agregar /crear 
put -> parametros / body json / modificar users existente
delete -> parametros / borrar
*/

app.get("/users", (request, response) => {
   response.json(users);
});

app.get("/users/:id", async (request, response) => {
   const { id } = request.params;

   const user = users.find((u) => u.id === +id);

   response.json(user);
});

app.put("/users/:id", (request, response) => {
   const { id } = request.params;

   if (Number.isNaN(parseInt(id))) {
      return response.status(400).json({
         msg: `El valor de id debe ser un numero`,
         parameter: {
            value: id,
         },
      });
   }

   const { name, phone } = request.body;

   const user = users.find((u) => u.id === +id);

   if (!user) {
      return response.status(404).json({
         msg: `El id ${id} no existe`,
      });
   }

   user.name = name ? name : user.name;
   user.phone = phone ? phone : user.phone;

   response.json(user);
});

app.delete("/users/:id", (request, response) => {
   const { id } = request.params;

   const user = users.find((u) => u.id === +id);

   if (!user) {
      return response.status(404).json({
         msg: `El id ${id} no existe`,
      });
   }
   const index = users.findIndex((u) => u.id === +id);
   users.splice(index, 1);

   response.json(user);
});

app.post("/users", (request, response) => {
   const { name, phone } = request.body;

   const nameExists = users.some((user) => user.name === name);
   if (nameExists) {
      return response
         .status(400)
         .json({ msg: `The name ${name} is already in use ` });
   }

   if (name.trim() === "") {
      return response.status(400).json({ msg: "The name cannot be empty" });
   }

   _id += 1;

   const newUser = {
      id: _id,
      name,
      phone,
   };

   users.push(newUser);

   response.status(201).json(newUser);
});

app.listen(3000, () => console.log("Running at port 3000"));
