"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline-sync"));
const db_simulada_1 = require("./database/db.simulada");
function leerTextoValidado(pregunta) {
    let entrada = "";
    while (entrada.trim() === "") {
        entrada = readline.question(pregunta);
        if (entrada.trim() === "") {
            console.log("Advertencia: Este campo no puede estar vacio.");
        }
    }
    return entrada;
}
function menuPrincipal() {
    while (true) {
        console.log("\n=== SISTEMA DE TALLER ===");
        console.log("[1] Salir");
        console.log("[2] Crear registro");
        console.log("[3] Listar registros");
        console.log("[4] Actualizar estado");
        const tecla = readline.keyIn("Selecciona una opcion [1-4]: ", { limit: '1234' });
        const db = (0, db_simulada_1.leerDB)();
        switch (tecla) {
            case '1':
                (0, db_simulada_1.limpiarDB)();
                console.log("Sistema cerrado. Base de datos vaciada.");
                process.exit(0);
            case '2':
                crearReporte(db);
                break;
            case '3':
                mostrarReportes(db);
                break;
            case '4':
                actualizarEstado(db);
                break;
        }
    }
}
function mostrarReportes(db) {
    if (db.length === 0)
        return console.log("Advertencia: No hay registros para mostrar.");
    console.log("\nLISTADO DE TODOS LOS REPORTES:");
    console.log("=================================");
    db.forEach((rep) => {
        console.log("-------- REPORTE " + rep.id + " --------");
        console.log("ID: " + rep.id);
        console.log("Titulo: " + rep.titulo);
        console.log("Descripcion: " + rep.descripcion);
        console.log("Reportado por: " + rep.reportadoPor);
        console.log("Prioridad: " + rep.prioridad);
        console.log("Estado: " + rep.estado.toUpperCase());
        console.log("---------------------------------\n");
    });
}
function crearReporte(db) {
    console.log("\n--- GENERAR NUEVO REPORTE ---");
    const titulo = leerTextoValidado("Titulo: ");
    const descripcion = leerTextoValidado("Descripcion: ");
    const nombre = leerTextoValidado("Nombre: ");
    console.log("\nPrioridad:");
    console.log("[1] Baja");
    console.log("[2] Media");
    console.log("[3] Alta");
    const tecla = readline.keyIn("Selecciona una opcion [1-3]: ", { limit: '123' });
    const prioridades = ['baja', 'media', 'alta'];
    const pIdx = parseInt(tecla) - 1;
    const nuevo = {
        id: db.length + 1,
        titulo,
        descripcion,
        reportadoPor: nombre,
        prioridad: prioridades[pIdx],
        estado: 'abierto',
        fechaCreacion: new Date()
    };
    db.push(nuevo);
    (0, db_simulada_1.guardarDB)(db);
    console.log("\nRegistro guardado con ID: " + nuevo.id);
}
function actualizarEstado(db) {
    if (db.length === 0)
        return console.log("Advertencia: No hay registros.");
    let reporte;
    // Bucle para controlar la busqueda del ID
    while (!reporte) {
        const input = readline.question("Ingresa el ID numerico del reporte (o escribe '0' para volver al menu): ");
        // Si el usuario escribe 0, salimos de la funcion
        if (input === '0')
            return;
        const id = parseInt(input);
        if (isNaN(id)) {
            console.log("Advertencia: Debes ingresar un numero valido.");
            continue; // Volver a preguntar
        }
        reporte = db.find(r => r.id === id);
        if (!reporte) {
            console.log("Advertencia: ID no encontrado. Verifica el ID en la opcion [3] Listar registros.");
        }
    }
    // Si llegamos aqui, significa que encontramos el reporte
    console.log("\nEstado actual: " + reporte.estado.toUpperCase());
    console.log("Selecciona nuevo estado:");
    console.log("[1] Abierto");
    console.log("[2] En progreso");
    console.log("[3] Resuelto");
    const tecla = readline.keyIn("Selecciona una opcion [1-3]: ", { limit: '123' });
    const estados = ['abierto', 'en progreso', 'resuelto'];
    reporte.estado = estados[parseInt(tecla) - 1];
    (0, db_simulada_1.guardarDB)(db);
    console.log("\nEstado actualizado a: " + reporte.estado.toUpperCase());
}
menuPrincipal();
