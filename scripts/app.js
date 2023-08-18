$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var valor_CARRINHO = 0;
var valor_ENTREGA = 5;

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

        $("#qntd-" + id).text(qntdAtual + 1);

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
            cardapio.metodos.carregarCarrinho();
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

    carregarCarrinho:()=>{

        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length >0){

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i,e) => {

                let temp = cardapio.templates.itemCarrinho
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                if((i +1) == MEU_CARRINHO.length){
                    cardapio.metodos.carregarValores();
                }
            })

        }else{

            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho esta vazio.</p>');
            cardapio.metodos.carregarValores();

        }

    },

    diminuirQuantidadeCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual>1){
            $("#qntd-carrinho-" + id).text(qntdAtual -1)
            cardapio.metodos.atualizarCarrinho(id, qntdAtual -1)
        }else{
            cardapio.metodos.removerCarrinho(id)
        }

    },

    aumentarQuantidadeCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1)
        cardapio.metodos.atualizarCarrinho(id, qntdAtual +1)
    },

    removerCarrinho: (id) =>{

        MEU_CARRINHO = $.grep(MEU_CARRINHO,(e,i) => {return e.id != id});
        cardapio.metodos.carregarCarrinho();

        cardapio.metodos.atualizarBadgeTotal();

    },

    atualizarCarrinho: (id,qntd) =>{

        let objIndex =MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        cardapio.metodos.atualizarBadgeTotal();

        cardapio.metodos.carregarValores();

    },

    carregarValores:()=>{

        valor_CARRINHO=0;

        $("#lbSubTotal").text("R$ 0,00");
        $("#lbValorEntrega").text("+ R$ 0,00");
        $("#lbValorTotal").text("R$ 0,00");

        $.each(MEU_CARRINHO, (i,e)=>{

            valor_CARRINHO += parseFloat(e.price * e.qntd);

            if((i +1) == MEU_CARRINHO.length){
                $("#lbSubTotal").text(`R$ ${valor_CARRINHO.toFixed(2)}`);
                $("#lbValorEntrega").text(`+ R$ ${valor_ENTREGA.toFixed(2)}`);
                $("#lbValorTotal").text(`R$ ${(valor_CARRINHO + valor_ENTREGA).toFixed(2)}`);
            }

        })

    },

    carregarEndereco:()=>{

        if(MEU_CARRINHO.length <=0){
            cardapio.metodos.mensagem('Seu carrinho esta vazio.')
            return;
        }
        cardapio.metodos.carregarEtapa(2);

    },

    buscarCep:()=>{

        var cep =$("#txtCEP").val().trim().replace(/\D/g, '');

        if(cep != ""){

            var valida = /^[0-9]{8}$/;

            if(valida.test(cep)){

                $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function( dados){
                    if(!("erro" in dados)){

                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("#txtNumero").focus();

                    }else{
                        cardapio.metodos.mensagem('Cep não encontrado')
                        $("#txtEndereco").focus();
                    }
                })

            }else{
                cardapio.metodos.mensagem('Formato do CEP invalido.')
                $("#txtCEP").focus();
            }

        }else{
            cardapio.metodos.mensagem('Informe o Cep, por favor.')
            $("#txtCEP").focus();
        }

    },

    resumoPedido:()=>{

        let cep =$("#txtCEP").val().trim();
        let rua =$("#txtEndereco").val().trim();
        let bairro =$("#txtBairro").val().trim();
        let cidade =$("#txtCidade").val().trim();
        let uf =$("#ddlUF").val().trim();
        let numero =$("#txtNumero").val().trim();
        let complemento =$("#txtComplemento").val().trim();

    
        if(cep.length <= 0){
            cardapio.metodos.mensagem('Informe o Cep!')
            $("#txtCEP").focus();
            return;
        }
        if(rua.length <= 0){
            cardapio.metodos.mensagem('Informe a rua!')
            $("#txtEndereco").focus();
            return;
        }
        if(bairro.length <= 0){
            cardapio.metodos.mensagem('Informe o bairro!')
            $("#txtBairro").focus();
            return;
        }
        if(cidade.length <= 0){
            cardapio.metodos.mensagem('Informe a cidade!')
            $("#txtCidade").focus();
            return;
        }
        if(uf.length <= 0){
            cardapio.metodos.mensagem('Informe o Estado!')
            $("#ddlUF").focus();
            return;
        }
        if(numero.length <= 0){
            cardapio.metodos.mensagem('Informe o numero!')
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO={
            cep:cep,
            endereco:rua,
            bairro:bairro,
            cidade:cidade,
            uf:uf,
            numero:numero,
            complemento:complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();
    },

    carregarResumo:()=>{

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO,(i,e)=>{

            let temp = cardapio.templates.itemResumo
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2))
                .replace(/\${qntd}/g, e.qntd)

                $("#listaItensResumo").append(temp)

        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}`);


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

    `,

    itemCarrinho:`
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" >
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>R$ \${price}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-items" id="qntd-carrinho-\${id}"> \${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="cardapio.metodos.removerCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
`,

itemResumo:`
    <div class="col-12 item-carrinho resumo">
        <div class="img-produto-resumo">
            <img src="\${img}">
        </div>
        <div class="dados-produto">
            <p class="title-produto-resumo"> 
                <b>\${name}</b>
            </p>
            <p class="price-produto-resumo"> 
                <b>\${price}</b>
            </p>
        </div>
        <p class="quantidade-produto-resumo">
            x <b>\${qntd}</b>
        </p>
    </div>

`

}