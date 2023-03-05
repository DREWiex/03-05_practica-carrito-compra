const objCosas = [
    {nombre: 'Pepe', edad: 20},
    {nombre: 'José', edad: 25},
    {nombre: 'Ana', edad: 20},
];

const cosas = [...new Set(objCosas.map((item) => item.edad))];
console.log(cosas);