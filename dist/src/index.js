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
function menuPrincipal() {
    while (true) {
        console.log("\n=== SISTEMA DE TALLER (MENÚ PRINCIPAL) ===");
        const opcionesRoles = ['Admin', 'Cliente'];
        const rol = readline.keyInSelect(opcionesRoles, "Selecciona tu rol:");
        // Si el usuario presiona 0 (Cancelar), salimos del bucle
        if (rol === -1) {
            console.log("Saliendo del sistema...");
            process.exit(0);
        }
        const db = (0, db_simulada_1.leerDB)();
        // Lógica de navegación basada en rol
        if (rol === 0) { // ADMIN
            const opcionesAdmin = ['Ver Reportes', 'Crear Reporte'];
            const acc = readline.keyInSelect(opcionesAdmin, "Acción Admin:");
            if (acc === 0) {
                mostrarReportes(db);
            }
            else if (acc === 1) {
                crearReporte(db);
            }
        }
        else { // CLIENTE
            const opcionesCliente = ['Crear Reporte'];
            const acc = readline.keyInSelect(opcionesCliente, "Acción Cliente:");
            if (acc === 0) {
                crearReporte(db);
            }
        }
    }
}
function mostrarReportes(db) {
    if (db.length === 0) {
        console.log("\n Actualmente no hay reportes en el sistema.");
    }
    else {
        console.log("\n LISTADO DE TODOS LOS REPORTES:");
        console.log("=================================");
        db.forEach((rep) => {
            console.log(`-------- REPORTE ${rep.id} --------`);
            console.log(`ID: ${rep.id}`);
            console.log(`Título: ${rep.titulo}`);
            console.log(`Descripción: ${rep.descripcion}`);
            console.log(`Reportado por: ${rep.reportadoPor}`);
            console.log(`Prioridad: ${rep.prioridad}`);
            console.log(`Estado: ${rep.estado.toUpperCase()}`);
            console.log(`Fecha: ${new Date(rep.fechaCreacion).toLocaleDateString()}`);
            console.log("---------------------------------\n");
        });
    }
}
function crearReporte(db) {
    console.log("\n--- GENERAR NUEVO REPORTE ---");
    const titulo = readline.question("Título: ");
    const descripcion = readline.question("Descripción: ");
    const nombre = readline.question("Nombre: ");
    const prioridades = ['baja', 'media', 'alta'];
    const pIdx = readline.keyInSelect(prioridades, "Prioridad: ");
    const nuevo = {
        id: db.length + 1,
        titulo,
        descripcion,
        reportadoPor: nombre,
        prioridad: prioridades[pIdx] || 'media',
        estado: 'abierto',
        fechaCreacion: new Date()
    };
    db.push(nuevo);
    (0, db_simulada_1.guardarDB)(db);
    console.log(` Reporte guardado con éxito. (ID: ${nuevo.id})`);
}
// Iniciar el programa
menuPrincipal();
