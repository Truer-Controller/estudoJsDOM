function novoElemento(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem 
}


function Barreira(reversa = false){
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function PardeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferiro = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferiro.elemento)


    this.sortearAbertura = () =>{
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferiro.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth
    
    this.sortearAbertura()
    this.setX(x)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new PardeBarreiras(altura, abertura, largura),
        new PardeBarreiras(altura, abertura, largura + espaco),
        new PardeBarreiras(altura, abertura, largura + espaco * 2),
        new PardeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento =  3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if(par.getX() < -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzou = par.getX() + deslocamento >= meio && par.getX() < meio
            if(cruzou) notificarPonto()
        })
    }
}

function Passaro(alturaJogo){
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY =  () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${ y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMax = alturaJogo - this.elemento.clientHeight

        if(novoY <= 0){
            this.setY(0)
        }else if(novoY >= alturaMax){
            this.setY(alturaMax)
        }else{
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function estaoSobre(elementoA,elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const hori = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vert = a.top + a.height >= b.top && b.top + b.height >= a.top
    return hori && vert
}

function colisao(passaro, barreiras){
    let colisao = false

    barreiras.pares.forEach(PardeBarreiras  =>{
        if(!colisao){
            const superior = PardeBarreiras.superior.elemento
            const inferiro = PardeBarreiras.inferiro.elemento
            colisao = estaoSobre(passaro.elemento, superior) || estaoSobre(passaro.elemento, inferiro)
        }
    })
    return colisao
}

function flappy(){
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura =  areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura,largura,200,400, () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)  
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () =>{
        const temporizador = setInterval(()=>{
            barreiras.animar()
            passaro.animar()

            if (colisao(passaro,barreiras)){
                clearInterval(temporizador)
            }
        }, 20)
    }
}
new flappy().start()




