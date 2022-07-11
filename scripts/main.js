const body = document.querySelector("body")

let chamber = document.querySelector("#senate") ? "senate" : "house"



    function tablaPartidosEstadosSenateHouse(members) {


        // Es la funcion que renderiza la tabla de senadores y house (Comienzo).

        function renderizadoListaCompletaSenadoresHouse(arrayDatos, idListaHml) {

            const lista = document.querySelector(`${idListaHml}`)

            lista.innerHTML = ""
            arrayDatos.forEach(datos => {
                let listaTabla = document.createElement("tr")

                listaTabla.innerHTML = `
            <td> <a href="${datos.url}">${datos.first_name} ${datos.middle_name ? datos.middle_name : ""} ${datos.last_name}</a></td>
            <td> ${datos.party} </td>
            <td> ${datos.state} </td>
            <td> ${datos.seniority} </td>
            <td> ${datos.votes_with_party_pct} </td  
            `
                lista.appendChild(listaTabla)

            })
        }

        // Es la funcion que renderiza la tabla de senadores y house (Termina).

        // Estados ordenados alfabeticamente y sin repetir (Comienza).

        const senadoresPorEstado = (estados) => {
            let filtro = [];
            estados.forEach(miembro => {
                if (!filtro.includes(miembro.state)) {
                    filtro.push(miembro.state)
                }
            })
            return (filtro.sort())
        }
        senadoresPorEstado(members)

        // Estados ordenados alfabeticamente y sin repetir (termina).

        // Agregado de estados al dropdown(Empieza).

        const formulario = document.querySelector("form")

        const etiquetaSelect = formulario.querySelector("select")

        const funcionAgregarEstadosDropdown = (arrayEstados) => {

            let optionParaInsertarLosEstados = document.createElement("option")
            etiquetaSelect.appendChild(optionParaInsertarLosEstados)

            optionParaInsertarLosEstados.innerText = "All states"
            optionParaInsertarLosEstados.value = "All"
            arrayEstados.forEach(datos => {

                optionParaInsertarLosEstados = document.createElement("option")

                optionParaInsertarLosEstados.innerHTML = `
            ${datos}
            `
                optionParaInsertarLosEstados.value = datos

                etiquetaSelect.appendChild(optionParaInsertarLosEstados)

            })
        }

        // Agregado de estados al dropdown(termina)

        // Armado de evento que al tocar el boton de checkbox, filtra por partidos. Falta por estados. (Comienza)

        formulario.addEventListener("change", () => {

            const checkbox = formulario.querySelectorAll("input[type='checkbox']")
            let arrayDeCheckboxes = Array.from(checkbox)
            let CheckboxChequeados = arrayDeCheckboxes.filter(condicion => condicion.checked)

            let valueCheckboxChequeados = CheckboxChequeados.map(condicion => condicion.value)

            let valueAsignadoACadaMiembro = etiquetaSelect.value

            let auxiliarPartidos = []

            const filtradoDePartido = () => {
                if ((valueCheckboxChequeados.length == 0)) {
                    auxiliarPartidos = members
                } else {

                    members.forEach(miembro =>
                        valueCheckboxChequeados.forEach(check => {
                            if (check == miembro.party) {
                                auxiliarPartidos.push(miembro)
                            }
                        })
                    )
                }

            }

            const filtradoDeEstados = () => {
                let auxiliarEstados = []
                auxiliarPartidos.forEach(miembro => {
                    if (valueAsignadoACadaMiembro == "All") {
                        auxiliarEstados.push(miembro)
                    } else if (valueAsignadoACadaMiembro == miembro.state) {
                        auxiliarEstados.push(miembro)
                    }
                })
                renderizadoListaCompletaSenadoresHouse(auxiliarEstados, `#tabla-${chamber}`)
            }
            console.log(auxiliarPartidos)
            filtradoDePartido()
            filtradoDeEstados()

        })

        renderizadoListaCompletaSenadoresHouse(members, `#tabla-${chamber}`)
        funcionAgregarEstadosDropdown(senadoresPorEstado(members))

        // Armado de evento que al tocar el boton de checkbox, filtra por partidos. (Termina)
    }


    function tablasEstadisticasSenadoresHouse(members) {

        // Tablas de Attendance //

        // Funcion para obtener la cantidad de miembros por partido. //

        function modularizarLargoPartidos(partido) {

            let auxiliarPartidos = []

            members.filter(miembro => {
                if (miembro.party == partido) {
                    auxiliarPartidos.push(miembro)
                }

            })

            return auxiliarPartidos.length

        }

        modularizarLargoPartidos("R")
        modularizarLargoPartidos("D")
        modularizarLargoPartidos("ID")


        let totalCantidadmiembrosPartido = (modularizarLargoPartidos("R") + modularizarLargoPartidos("D") + modularizarLargoPartidos("ID"))

        // Funcion para contador de votos por partido //

        function contadorPorcentajesVotos(partido) {

            let auxiliarCantidadVotos = 0

            members.forEach(miembro => {
                if (miembro.party == partido) {
                    auxiliarCantidadVotos += miembro.votes_with_party_pct;
                }
            })

            let votosPorPartido = (auxiliarCantidadVotos / modularizarLargoPartidos(partido))

            if (modularizarLargoPartidos(partido) == 0) {
                votosPorPartido = 0
            }

            return votosPorPartido

        }

        // Obtencion del total de la suma de los porcentajes de los votos del partido. //

        let totalVotosRep = (modularizarLargoPartidos("R") * contadorPorcentajesVotos("R"))
        let totalVotosDem = (modularizarLargoPartidos("D") * contadorPorcentajesVotos("D"))
        let totalVotosId = (modularizarLargoPartidos("ID") * contadorPorcentajesVotos("ID"))

        let totalVotos = (totalVotosDem + totalVotosId + totalVotosRep)
        let porcentajeTotalVotos = (totalVotos / totalCantidadmiembrosPartido)

        // Dibujo de la tabla con los datos anteriores //

        function dibujaTablaArribaDerecha(id, partido, siglas) {

            let trGeneral = document.querySelector(id)

            trGeneral.innerHTML +=
                `
    <th>${partido}</th>
    <td>${modularizarLargoPartidos(`${siglas}`)}</td>
    <td>${contadorPorcentajesVotos(`${siglas}`).toFixed(2)} &#37;</td>
    
    `

        }

        function dibujaTablaDerechaArribaTotales(id, partido) {

            let trGeneral = document.querySelector(id)

            trGeneral.innerHTML +=
                `
    <th>${partido}</th>
    <td>${totalCantidadmiembrosPartido}</td>
    <td>${porcentajeTotalVotos.toFixed(2)} &#37;</td>
    
    `
        }

        // Tabla derecha arriba (Finaliza)

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        let copia = members.map(miembro => miembro)
        let copia1 = members.map(miembro => miembro)

        function modularizarSortMayorAMenor(array) {

            let aux = array.sort((a, b) => {
                if (a.missed_votes_pct > b.missed_votes_pct) {
                    return -1
                }
                if (a.missed_votes_pct < b.missed_votes_pct) {
                    return 1
                } else {
                    return 0
                }
            })
            return aux
        }

        function modularizarSortMenorAMayor(array) {

            let aux = array.sort((a, b) => {
                if (a.missed_votes_pct < b.missed_votes_pct) {
                    return -1
                }
                if (a.missed_votes_pct > b.missed_votes_pct) {
                    return 1
                } else {
                    return 0
                }
            })
            return aux
        }

        let auxiliarMenorMayorVotes = modularizarSortMenorAMayor(copia)
        let auxiliarMayorMenorVotes = modularizarSortMayorAMenor(copia1)

        auxiliarMenorMayorVotes = auxiliarMenorMayorVotes.filter(miembro => miembro.total_votes >= 1)

        function filtroDiez(array) {
            let aux1 = []
            let aux2 = copia.length * 0.1
            for (i = 0; i < Math.floor(aux2); i++) {
                !aux1.includes(array[i]) ? aux1.push(array[i]) : ""

                array.forEach(member => {
                    if (member.missed_votes_pct === array[i].missed_votes_pct && !aux1.includes(member)) {
                        aux1.push(member)
                    }
                })
            }
            return aux1
        }

        filtroDiez(auxiliarMenorMayorVotes)
        filtroDiez(auxiliarMayorMenorVotes)

        // Inyectar datos a la tabla de Missed votes (Comienza) //

        const inyectarDatosMissedVotes = (array, IdLista) => {
            const tablaMenosComprometidos = document.querySelector(`#${IdLista}`)
            const tablaMasComprometidos = document.querySelector(`#${IdLista}`)

            array.forEach(miembro => {

                let filasTablaMissedVotes = document.createElement("tr")
                filasTablaMissedVotes.innerHTML = `

    <td> <a href="${miembro.url}">${miembro.first_name} ${miembro.middle_name ? miembro.middle_name : ""} ${miembro.last_name}</a></td>
    <td> ${miembro.missed_votes} </td>
    <td> ${miembro.missed_votes_pct.toFixed(2)} &#37;</td>

`
                tablaMenosComprometidos.appendChild(filasTablaMissedVotes)
                tablaMasComprometidos.appendChild(filasTablaMissedVotes)
            })
        }

        // Tabla izquierda abajo (Termina) //

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Tabla derecha abajo (Comienza)

        let copia3 = members.map(miembro => miembro)
        let copia4 = members.map(miembro => miembro)

        function modularizarSortMayorAMenorParty(array) {

            let aux = array.sort((a, b) => {
                if (a.votes_with_party_pct > b.votes_with_party_pct) {
                    return -1
                }
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                    return 1
                } else {
                    return 0
                }
            })
            return aux
        }

        function modularizarSortMenorAMayorParty(array) {

            let aux = array.sort((a, b) => {
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                    return -1
                }
                if (a.votes_with_party_pct > b.votes_with_party_pct) {
                    return 1
                } else {
                    return 0
                }
            })
            return aux
        }

        let auxiliarMenorMayorParty = modularizarSortMenorAMayorParty(copia3)
        let auxiliarMayorMenorParty = modularizarSortMayorAMenorParty(copia4)

        auxiliarMenorMayorParty = auxiliarMenorMayorParty.filter(miembro => miembro.total_votes >= 1)

        function filtroDiezParty(array) {
            let aux1 = []
            let aux2 = copia3.length * 0.1
            for (let i = 0; i < Math.floor(aux2); i++) {
                !aux1.includes(array[i]) ? aux1.push(array[i]) : ""

                array.forEach(member => {
                    if (member.votes_with_party_pct === array[i] && !aux1.includes(member)) {
                        aux1.push(member)
                    }
                })
            }
            return aux1
        }

        filtroDiezParty(auxiliarMayorMenorParty)
        filtroDiezParty(auxiliarMenorMayorParty)

        // Inyectar datos a la tabla de Missed votes (Comienza)


        const inyectarDatosEngParty = (array, idTabla) => {
            const tablaMenosComprometidosParty = document.querySelector(`#${idTabla}`)
            const tablaMasComprometidosParty = document.querySelector(`#${idTabla}`)
            array.forEach(miembro => {

                let filasTablaEngParty = document.createElement("tr")
                filasTablaEngParty.innerHTML = `

    <td> <a href="${miembro.url}">${miembro.first_name} ${miembro.middle_name ? miembro.middle_name : ""} ${miembro.last_name}</a></td>
    <td> ${(miembro.total_votes / 100 * miembro.votes_with_party_pct).toFixed()} </td>
    <td> ${miembro.votes_with_party_pct.toFixed(2)} &#37;</td>

`
                tablaMenosComprometidosParty.appendChild(filasTablaEngParty)
                tablaMasComprometidosParty.appendChild(filasTablaEngParty)
            })
        }


        // Inyectar datos a la tabla de Missed votes (Termina)

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Condicion para la ejecucion de las funciones de acuerdo a que tipo de datos se quiere mostrar

        if (body.classList.contains("attendance")) {
            dibujaTablaArribaDerecha("#trRep", "Republicans", "R")
            dibujaTablaArribaDerecha("#trDem", "Democrates", "D")
            dibujaTablaArribaDerecha("#trID", "Independents", "ID")
            dibujaTablaDerechaArribaTotales("#trTotal", "Total")
            inyectarDatosMissedVotes(filtroDiez(auxiliarMayorMenorVotes), `tablaMostMissedVotes-${chamber}`)
            inyectarDatosMissedVotes(filtroDiez(auxiliarMenorMayorVotes), `tablaLeastMissedVotes-${chamber}`)
        } else if (body.classList.contains("partyloyalty")) {
            dibujaTablaArribaDerecha("#trRep", "Republicans", "R")
            dibujaTablaArribaDerecha("#trDem", "Democrates", "D")
            dibujaTablaArribaDerecha("#trID", "Independents", "ID")
            dibujaTablaDerechaArribaTotales("#trTotal", "Total")
            inyectarDatosEngParty(filtroDiezParty(auxiliarMayorMenorParty), `tablaMostPartyVotes-${chamber}`)
            inyectarDatosEngParty(filtroDiezParty(auxiliarMenorMayorParty), `tablaLeastPartyVotes-${chamber}`)
        }

    }


const URLCHAMBER = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "5l188rvw70EJUSymbLs8oieldjiDdBPU27euJ9b0"
    }
}

fetch(URLCHAMBER, init)
    .then(response => response.json())
    .then(data => {
        const datos = data.results[0].members
        if (body.classList.contains("tablafiltros")) {
        tablaPartidosEstadosSenateHouse(datos)
        } else{
        tablasEstadisticasSenadoresHouse(datos)
        }


    })