Vue.createApp({
    data() {
        return {
            URLAPI: "",
            init: {
                method: "GET",
                headers: {
                    "X-API-Key": "5l188rvw70EJUSymbLs8oieldjiDdBPU27euJ9b0"
                }
            },
            miembros: [],
            estadosFiltrados: [],
            selected: "All",
            partidos: [],
            auxiliarCantidadVotos: "",
            estados: [],
            auxiliarPartidos: [],
            auxiliarEstados: [],
            totalLargoPartido: "",
            auxiliarTotalVotos: "",
            auxiliarFinalVotos: "",
            menorMayor: [],
            mayorMenor: [],
            mayorMenorLoyalty: [],
            menorMayorLoyalty: []


        }
    },


    created() {
        let chamber = document.querySelector("#senate") ? "senate" : "house"
        this.URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`
        fetch(this.URLAPI, this.init)
            .then(response => response.json())
            .then(data => {
                this.miembros = data.results[0].members
                this.miembros.forEach(miembro => {
                    if (!this.estadosFiltrados.includes(miembro.state)) {
                        this.estadosFiltrados.push(miembro.state)
                    }
                });
                return this.estadosFiltrados.sort()
            })

    },


    methods: {

        largoPartidos(partido) {
            let auxiliarLargo = []
            this.miembros.forEach(miembro => {
                if (miembro.party == partido) {
                    auxiliarLargo.push(miembro.party)
                }
            })
            return auxiliarLargo.length
        },

        totalPartidos() {
            this.totalLargoPartido = (this.largoPartidos("R") + this.largoPartidos("D") + this.largoPartidos("ID"))
            return this.totalLargoPartido
        },

        contadorVotos(partido) {

            this.auxiliarCantidadVotos = 0

            this.miembros.forEach(miembro => {
                if (miembro.party == partido) {
                    this.auxiliarCantidadVotos += miembro.votes_with_party_pct;
                }
            })

            let votosPorPartido = (this.auxiliarCantidadVotos / this.largoPartidos(partido))

            if (this.largoPartidos(partido) == 0) {
                votosPorPartido = 0

            }

            return votosPorPartido
        },

        contadorVotosTotal() {

            this.auxiliarTotalVotos = (this.contadorVotos("R") * this.largoPartidos("R") + this.contadorVotos("D") * this.largoPartidos("D") + this.contadorVotos("ID") * this.largoPartidos("ID"))
            this.auxiliarFinalVotos = (this.auxiliarTotalVotos / this.totalPartidos())

            return this.auxiliarFinalVotos
        },



    },

    computed: {

        filtradoDePartido() {
            this.auxiliarPartidos = []
            this.auxiliarEstados = []

            if ((this.partidos.length == 0)) {
                this.auxiliarPartidos = this.miembros
            } else {

                this.miembros.forEach(miembro =>
                    this.partidos.forEach(check => {
                        if (check == miembro.party) {
                            this.auxiliarPartidos.push(miembro)
                        }
                    })
                )
            }

        
            this.auxiliarPartidos.forEach(miembro => {
                if (this.selected == "All") {
                    this.auxiliarEstados.push(miembro)
                } else if (this.selected == miembro.state) {
                    this.auxiliarEstados.push(miembro)
        }
        

        })
    },


        modularizarSortMayorMenorAttendance() {

            this.mayorMenor = this.miembros.sort((a, b) => {
                if (a.missed_votes_pct > b.missed_votes_pct) {
                    return -1
                }
                if (a.missed_votes_pct < b.missed_votes_pct) {
                    return 1
                } else {
                    return 0
                }
            })

            this.mayorMenor = this.mayorMenor.filter(miembro => miembro.total_votes >= 1)

            let auxiliarFiltrosMayorMenorAtt = []
            let largo = Math.floor(this.miembros.length * 0.1)

            for (let i = 0; i < largo; i++) {
                !auxiliarFiltrosMayorMenorAtt.includes(this.mayorMenor[i]) ? auxiliarFiltrosMayorMenorAtt.push(this.mayorMenor[i]) : ""

                this.miembros.forEach(miembro => {
                    if (miembro.missed_votes_pct === this.mayorMenor[i].missed_votes_pct && !auxiliarFiltrosMayorMenorAtt.includes(miembro)) {
                        auxiliarFiltrosMayorMenorAtt.push(miembro)
                    }
                })
            }
            return auxiliarFiltrosMayorMenorAtt
        },

        modularizarSortMenorMayorattendance() {

            this.menorMayor = this.miembros.sort((a, b) => {
                if (a.missed_votes_pct < b.missed_votes_pct) {
                    return -1
                }
                if (a.missed_votes_pct > b.missed_votes_pct) {
                    return 1
                } else {
                    return 0
                }
            })
            this.menorMayor = this.menorMayor.filter(miembro => miembro.total_votes >= 1)

            let auxiliarFiltrosMenorMayorAtt = []
            let largo = Math.floor(this.miembros.length * 0.1)
            for (i = 0; i < largo; i++) {
                !auxiliarFiltrosMenorMayorAtt.includes(this.menorMayor[i]) ? auxiliarFiltrosMenorMayorAtt.push(this.menorMayor[i]) : ""

                this.miembros.forEach(miembro => {
                    if (miembro.missed_votes_pct == this.menorMayor[i].missed_votes_pct && !auxiliarFiltrosMenorMayorAtt.includes(miembro)) {
                        auxiliarFiltrosMenorMayorAtt.push(miembro)
                    }
                })
            }
            return auxiliarFiltrosMenorMayorAtt
        },

        modularizarSortMayorMenorLoyalty() {

            this.mayorMenorLoyalty = this.miembros.sort((a, b) => {
                if (a.votes_with_party_pct > b.votes_with_party_pct) {
                    return -1
                }
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                    return 1
                } else {
                    return 0
                }
            })

            this.mayorMenorLoyalty = this.mayorMenorLoyalty.filter(miembro => miembro.total_votes >= 1)

            let auxiliarFiltrosMayorMenorLoyalty = []
            let largo = Math.floor(this.miembros.length * 0.1)
            for (i = 0; i < largo; i++) {
                !auxiliarFiltrosMayorMenorLoyalty.includes(this.mayorMenorLoyalty[i]) ? auxiliarFiltrosMayorMenorLoyalty.push(this.mayorMenorLoyalty[i]) : ""

                this.miembros.forEach(miembro => {
                    if (miembro.votes_with_party_pct == this.mayorMenorLoyalty[i].votes_with_party_pct && !auxiliarFiltrosMayorMenorLoyalty.includes(miembro)) {
                        auxiliarFiltrosMayorMenorLoyalty.push(miembro)
                    }
                })
            }
            return auxiliarFiltrosMayorMenorLoyalty
        },

        modularizarSortMenorMayorLoyalty() {

            this.menorMayorLoyalty = this.miembros.sort((a, b) => {
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                    return -1
                }
                if (a.votes_with_party_pctt > b.votes_with_party_pct) {
                    return 1
                } else {
                    return 0
                }
            })
            this.menorMayorLoyalty = this.menorMayorLoyalty.filter(miembro => miembro.total_votes >= 1)

            let auxiliarFiltrosMenorMayorLoyalty = []
            let largo = Math.floor(this.miembros.length * 0.1)

            for (i = 0; i < largo; i++) {
                !auxiliarFiltrosMenorMayorLoyalty.includes(this.menorMayorLoyalty[i]) ? auxiliarFiltrosMenorMayorLoyalty.push(this.menorMayorLoyalty[i]) : ""

                this.miembros.forEach(miembro => {
                    if (miembro.votes_with_party_pct == this.menorMayorLoyalty[i].votes_with_party_pct && !auxiliarFiltrosMenorMayorLoyalty.includes(miembro)) {
                        auxiliarFiltrosMenorMayorLoyalty.push(miembro)
                    }
                })
            }
            return auxiliarFiltrosMenorMayorLoyalty
        },



    }
}).mount('#app')