$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {

    obterItensCardapio : (categoria = 'burgers') => {

        var filtro = MENU[categoria]

        $("#itensCardapio").html('')

        $.each(filtro, (i,e) => {

            let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2));

            $("#itensCardapio").append(temp)

        })

        $(".container-menu a").removeClass('active');

        $("#menu-" + categoria).addClass('active');
    },

}

cardapio.templates = {

    item: `
            <div class="col-3 mb-4">
                <div class="card card-item">
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
                        <span class="btn-menos"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-items">0</span>
                        <span class="btn-mais"><i class="fas fa-plus"></i></span>
                        <span class="btn-add"><i class="fas fa-shopping-bag"></i></span>
                    </div>
                </div>
            </div>

    `

}