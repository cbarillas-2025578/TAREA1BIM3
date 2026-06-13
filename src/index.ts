import * as readline from 'readline-sync';
import { leerDB, guardarDB, limpiarDB } from './database/db.simulada';
import type { Incidente } from './models/incidente.model';

function leerTextoValidado(pregunta: string): string {
    let entrada = "";
    while (entrada.trim() === "") {
        entrada = readline.question(pregunta);
        if (entrada.trim() === "") {
            console.log("Advertencia: Este campo no puede estar vacio.");
        }
    }
    return entrada;
}

function menuPrincipal(): void {
    while (true) {
        console.log("\n=== SISTEMA DE TALLER ===");
        console.log("[1] Salir");
        console.log("[2] Crear registro");
        console.log("[3] Listar registros");
        console.log("[4] Actualizar estado");
        
        const tecla = readline.keyIn("Selecciona una opcion [1-4]: ", {limit: '1234'});
        const db = leerDB();

        switch (tecla) {
            case '1':
                limpiarDB();
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

function mostrarReportes(db: Incidente[]): void {
    if (db.length === 0) return console.log("Advertencia: No hay registros para mostrar.");
    
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

function crearReporte(db: Incidente[]): void {
    console.log("\n--- GENERAR NUEVO REPORTE ---");
    const titulo = leerTextoValidado("Titulo: ");
    const descripcion = leerTextoValidado("Descripcion: ");
    const nombre = leerTextoValidado("Nombre: ");
    
    console.log("\nPrioridad:");
    console.log("[1] Baja");
    console.log("[2] Media");
    console.log("[3] Alta");
    
    const tecla = readline.keyIn("Selecciona una opcion [1-3]: ", {limit: '123'});
    const prioridades = ['baja', 'media', 'alta'];
    const pIdx = parseInt(tecla) - 1;

    const nuevo: Incidente = {
        id: db.length + 1,
        titulo,
        descripcion,
        reportadoPor: nombre,
        prioridad: prioridades[pIdx] as any,
        estado: 'abierto',
        fechaCreacion: new Date()
    };
    
    db.push(nuevo);
    guardarDB(db);
    console.log("\nRegistro guardado con ID: " + nuevo.id);
}

function actualizarEstado(db: Incidente[]): void {
    if (db.length === 0) return console.log("Advertencia: No hay registros.");
    
    let reporte: Incidente | undefined;
    
    // Bucle para controlar la busqueda del ID
    while (!reporte) {
        const input = readline.question("Ingresa el ID numerico del reporte (o escribe '0' para volver al menu): ");
        
        // Si el usuario escribe 0, salimos de la funcion
        if (input === '0') return;

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

    const tecla = readline.keyIn("Selecciona una opcion [1-3]: ", {limit: '123'});
    const estados = ['abierto', 'en progreso', 'resuelto'];
    
    reporte.estado = estados[parseInt(tecla) - 1] as any;
    guardarDB(db);
    console.log("\nEstado actualizado a: " + reporte.estado.toUpperCase());
}

menuPrincipal();