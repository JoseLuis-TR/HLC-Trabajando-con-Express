const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());

// --------------------------------------------------------------------------------
// 3.7 y 3.8
// Configura morgan para que te muestre mensajes de log de las peticiones que recibe el
// servidor usando la configuración tiny. Despues modificarlo para que muestre además
// la información enviada en peticiones POST

// Middleware morgan con configuración tiny
app.use(morgan('tiny'));

// Middleware morgan con configuración para mostrar la información de tiny más
// la información enviada en la petición POST
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Para conseguir la información enviada en la petición POST se ha escrito un token
// con el cual conseguimos sacar esa información cuando recibimos un método POST
// la cual se añade dentro de la propia petición POST en la línea 103
// Se ve tal que así -> morgan.token('body', request => JSON.stringify(request.body))
// --------------------------------------------------------------------------------


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-5423122"
    },
]

// --------------------------------------------------------------------------------

// 3.1
// Muestra una lista hardcodeada de las entrada de la agenda telefóncia
// al entrar a http://localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

// 3.2
// Implementar una página en la dirección http://localhost:3001/info
// que muestre el número de personas en la agenda y la fecha de la petición
app.get('/info', (request, response) => {
    console.log(typeof persons)
    let tamañoAgenda = Object.keys(persons).length;
    let fecha = new Date();
    response.send(`<p>La agenda telefónica tiene a ${tamañoAgenda} personas</p><p>${fecha}</p>`);
    response.send(`${fecha.getDate()}`);
})

// 3.3
// Añadir la funcionalidad para poder mostrar información de un solo
// registro de la agenda
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const persona = persons.find(persona => persona.id === id);

    if(persona) {
        response.json(persona);
    } else {
        response.status(404).end()
    }
})

// 3.4
// Implementar la posibilidad de eliminar una entrada de la agenda
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(persona => persona.id !== id)

    response.status(204).end()
})

// 3.5 y 3.6
// Añadir la funcionalidad de poder añadir nuevas entradas a la agenda
// usando Math.random para indicar valores aleatorios a los ids además de
// tener en cuenta que no puede faltar nombre o número y además, los nombres
// deben ser únicos.
const duplicado = (nombre) => {
    return Object.values(persons).includes(nombre);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    morgan.token('body', request => JSON.stringify(request.body))

    if(!body.name){
        return response.status(400).json({
            error: 'Falta un nombre'
        })
    } else if(!body.number){
        return response.status(400).json({
            error: 'Falta un numero de telefono'
        })
    }

    if(!duplicado(body.name)){
        return response.status(400).json({
            error: 'El nombre debe ser único'
        })
    }

    const persona = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(persona);

    response.json(persona);
})

// --------------------------------------------------------------------------------

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server funcionando en el puerto ${PORT}`)
})