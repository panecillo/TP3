new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        puedeCurar: 0,
        puedeAtaqueEspecial: 0,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
        leyendaAtaque: 'EL JUGADOR GOLPEA AL MONSTRUO POR ',
        leyendaAtaqueEspecial: 'EL JUGADOR GOLPEA DURAMENTE AL MONSTRUO POR ',
        leyendaAtaqueMonstruo: 'EL MONSTRUO LASTIMA AL JUGADOR POR '
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.puedeCurar = 0;
            this.puedeAtaqueEspecial = 0;
            this.turnos = new Array();
            this.hayUnaPartidaEnJuego = true
        },
        atacar: function () {
            if(this.saludJugador <= this.saludMonstruo){
                this.esJugador = true;
                var ataqueJugador = this.calcularHeridas(this.rangoAtaque[0], this.rangoAtaque[1])
                this.saludMonstruo -= ataqueJugador
                this.registrarEvento(this.leyendaAtaque + ataqueJugador)
                if (this.verificarGanador()){
                    this.saludMonstruo = 0;
                    this.finalizar()
                    return;
                }
                this.recargarCuracion();
                this.recargarAtaqueEspecial();
                this.esJugador = false;
                this.ataqueDelMonstruo()
            }
            else{
                this.ataqueDelMonstruo()
                this.esJugador = true;
                var ataqueJugador = this.calcularHeridas(this.rangoAtaque[0], this.rangoAtaque[1])
                this.saludMonstruo -= ataqueJugador
                this.registrarEvento(this.leyendaAtaque + ataqueJugador)
                if (this.verificarGanador()){
                    this.finalizar()
                    this.saludMonstruo = 0;
                    return;
                }
                this.recargarCuracion();
                this.recargarAtaqueEspecial();
                this.esJugador = false;  
            }
        },

        ataqueEspecial: function () {
            if(this.puedeAtaqueEspecial >= 4) {
                if(this.saludJugador <= this.saludMonstruo){
                    this.esJugador = true;
                    var ataqueJugador = this.calcularHeridas(this.rangoAtaqueEspecial[0], this.rangoAtaqueEspecial[1])
                    this.saludMonstruo -= ataqueJugador
                    this.registrarEvento(this.leyendaAtaqueEspecial + ataqueJugador)
                    if (this.verificarGanador()){
                        this.saludMonstruo = 0;
                        this.finalizar()
                        return;
                    }
                    this.recargarCuracion();
                    this.puedeAtaqueEspecial = 0;
                    this.esJugador = false;
                    this.ataqueDelMonstruo()
                }
                else{
                    this.ataqueDelMonstruo()
                    this.esJugador = true;
                    var ataqueJugador = this.calcularHeridas(this.rangoAtaqueEspecial[0], this.rangoAtaqueEspecial[1])
                    this.saludMonstruo -= ataqueJugador
                    this.registrarEvento(this.leyendaAtaqueEspecial + ataqueJugador)
                    if (this.verificarGanador()){
                        this.saludMonstruo = 0;
                        this.finalizar()
                        return;
                    }
                    this.recargarCuracion();
                    this.puedeAtaqueEspecial = 0;
                    this.esJugador = false;  
                }
            }
        },

        curar: function () {
            if(this.puedeCurar >= 3){
                this.saludJugador += Math.max(Math.floor(Math.random()*25) + 1, 5)
                this.esJugador = false; 
                this.puedeCurar = 0;               
            }
        },

        registrarEvento(evento) {
            this.turnos.unshift({esJugador: this.esJugador, text: evento+"%"});
        },
        terminarPartida: function () {
            if (confirm("Te has rendido! Quieres jugar otra vez?")) {
                this.empezarPartida();
            } 
        },

        ataqueDelMonstruo: function () {
            this.esJugador = false;
            var ataqueMonstruo = this.calcularHeridas(this.rangoAtaqueDelMonstruo[0], this.rangoAtaqueDelMonstruo[1])
            this.saludJugador -= ataqueMonstruo
            this.registrarEvento(this.leyendaAtaque + ataqueMonstruo)  
            if (this.verificarGanador()){
                this.saludJugador = 0;
                this.finalizar()
                return;
            }
            this.esJugador = true;  
        },

        calcularHeridas: function (min, max) {
            return Math.max(Math.floor(Math.random()*max) + 1, min)
        },
        verificarGanador: function () {
            return (this.saludJugador <= 0 || this.saludMonstruo <= 0);
        },
        recargarCuracion: function () {
            this.puedeCurar++;
        },
        recargarAtaqueEspecial: function () {
            this.puedeAtaqueEspecial++;
        },
        finalizar: function () {
            if(this.esJugador){
                if (confirm("Derrotaste al Monstruo! Quieres jugar otra vez?")) {
                    this.empezarPartida();
                }
                else {
                    this.hayUnaPartidaEnJuego = false
                    return;
                } 
            }
            else{
                if (confirm("Has perdido! Quieres jugar otra vez?")) {
                    this.empezarPartida();
                } 
                else {
                    this.hayUnaPartidaEnJuego = false
                    return;
                }
            }
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});