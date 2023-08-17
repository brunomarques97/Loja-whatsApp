$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {

    obterItensCardapio : (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria]

        if(!vermais){
            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i,e) => {

            let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2))
            .replace(/\${id}/g, e.id)

            //botão ver mais
            if(vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }

            //pagina inicial
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp)
            }

        })

        $(".container-menu a").removeClass('active');

        $("#menu-" + categoria).addClass('active');
    },

    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo,true);

        $("#btnVerMais").addClass('hidden');

    },

    diminuirQuantidade: (id) =>{

        
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual>0){
            $("#qntd-" + id).text(qntdAtual -1)
        }

    },

    aumentarQuantidade: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        $("#qntd-" + id).text(qntdAtual + 1)

    },

    adicionarCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual>0){

            //obter categoria
            var categoria= $(".container-menu a.active").attr('id').split('menu-')[1];

            //obter lista
            let  filtro  = MENU[categoria];

            let item  = $.grep(filtro,(e,i)=> { return e.id == id});

            if (item.length >0){

                let existe = $.grep(MEU_CARRINHO,(elem,index)=> { return elem.id == id});

                if(existe.length >0){
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));

                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                }else{
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }
                cardapio.metodos.mensagem('Item adicionado ao carrinho','green');
                $("#qntd-" + id).text(0)

                cardapio.metodos.atualizarBadgeTotal();

            }

        }

    },

    atualizarBadgeTotal: () =>{

        var total = 0;

        $.each(MEU_CARRINHO,(i,e) =>{
            total += e.qntd
        })

        if(total>0){
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden')
            
        }else{
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").removeClass('hidden')
        }

        $(".badge-total-carrinho").html(total)

    },

    abrirCarrinho: (abrir)=>{

        if(abrir==true){
            $("#modalCarrinho").removeClass("hidden")
            cardapio.metodos.carregarEtapa(1)
        }else{
            $("#modalCarrinho").addClass("hidden")
        }
    },

    carregarEtapa:(etapa)=>{

        if(etapa == 1){

            $("#lbTituloEtapa").text('Seu carrinho:');
            $('#itensCarrinho').removeClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");

            $("btnEtapaPedido").removeClass("hidden");
            $("btnEtapaEndereco").addClass("hidden");
            $("btnEtapaResumo").addClass("hidden");
            $("btnVoltar").addClass("hidden");

        }else if(etapa == 2){

            $("#lbTituloEtapa").text('Endereço de entrega:');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').removeClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");

            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").removeClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnVoltar").removeClass("hidden");

        }else if(etapa == 3){
            $("#lbTituloEtapa").text('Resumo do pedido:');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').removeClass('hidden');

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");
            $(".etapa3").addClass("active");

            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").addClass("hidden");
            $("#btnEtapaResumo").removeClass("hidden");
            $("#btnVoltar").removeClass("hidden");
        }

    },

    voltaEtapa:()=>{

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1)

    },

    mensagem:(texto,cor ='red',tempo = 2500 )=>{

        let id = Math.floor(Date.now()* Math.random()).toString();



        let msg = `<div id="msg-${id}" class= "animated fadeInDown toast ${cor}">${texto}</div>`

        $('#containerMensagens').append(msg);

        setTimeout(()=>{
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(()=>{
                $("#msg-" + id).remove();
            },800)
        }, tempo)
    },
 
}

cardapio.templates = {

    item: `
            <div class="col-3 mb-4">
                <div class="card card-item"  id="\${id}">
                    <div class="img-produto">
                        <img src="\${img}"/>
                    </div>
                    <p class="title-produto text-center mt-4">
                        <b>\${name}</b>
                    </p>
                    <p class="price-produto text-center">
                        <b>R$ \${price}</b>
                    </p>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-items" id="qntd-\${id}">0</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-add" onclick="cardapio.metodos.adicionarCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                    </div>
                </div>
            </div>

    `

}