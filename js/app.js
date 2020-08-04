/**
 * URL Base da API
 */
const baseUrlApi = 'http://fipeapi.appspot.com/api/1';

/**
 * Seleção dos elementos de formulário no HTML
 */
const brand = document.querySelector('#vehicles_brand');
const model = document.querySelector('#vehicles_model');
const year = document.querySelector('#vehicles_year');
const btn = document.querySelector('.search_button');

var type = "";

const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.modal .close')

/**
 * Option em branco para utilização no formulário
 */
const defaultOption = document.createElement('option');
defaultOption.value = "";
defaultOption.innerText = "- - -";

/**
 * Funções de consulta à API
 */
function getBrands() {

    brand.removeAttribute('disabled');

    fetch(`${baseUrlApi}/${type}/marcas.json`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        brand.innerHTML = "";
        brand.appendChild(defaultOption);
        
        for(item of data) {
            const option = document.createElement('option');
            option.value = item.id;
            option.innerText = item.name;

            brand.appendChild(option);
        }

    });
}

function getModels() {

    model.removeAttribute('disabled');
    
    fetch(`${baseUrlApi}/${type}/veiculos/${brand.value}.json`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        model.innerHTML = "";
        model.appendChild(defaultOption);
        
        for(item of data) {
            const option = document.createElement('option');
            option.value = item.id;
            option.innerText = item.name;

            model.appendChild(option);
        }

    });
}

function getYears() {

    year.removeAttribute('disabled');

    // A URL é com "veiculo" no singular
    fetch(`${baseUrlApi}/${type}/veiculo/${brand.value}/${model.value}.json`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        
        year.innerHTML = "";
        year.appendChild(defaultOption);
        
        for(item of data) {
            const option = document.createElement('option');
            option.value = item.id;
            option.innerText = item.name;

            year.appendChild(option);
        }

    });
}

function getPrice() {

    // A URL é com "veiculo" no singular
    fetch(`${baseUrlApi}/${type}/veiculo/${brand.value}/${model.value}/${year.value}.json`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        const vehicleName = document.querySelector('.vehicle_name');
        vehicleName.innerText = data.name;
        
        const referenceMonth = document.querySelector('.reference_month .value');
        referenceMonth.innerText = data.referencia;

        const fipeCode = document.querySelector('.fipe_code .value');
        fipeCode.innerText = data.fipe_codigo;

        const brand = document.querySelector('.brand .value');
        brand.innerText = data.marca;

        const year = document.querySelector('.year .value');
        year.innerText = data.ano_modelo;

        const price = document.querySelector('.price');
        price.innerText = data.preco;

        modal.classList.remove('hide_modal');

    });
}

brand.addEventListener('change', function() {
    resetModel();
    resetYear();
    getModels();

    btn.classList.remove('search_button_show');
});

model.addEventListener('change', function() {
    getYears();

    btn.classList.remove('search_button_show');
});

year.addEventListener('change', function() {
    if(brand.value != "" && model.value != "" && year.value != "") {
        btn.classList.add('search_button_show');
    } else {
        btn.classList.remove('search_button_show');
    }
});

btn.addEventListener('click', function() {
    if(brand.value != "" && model.value != "" && year.value != "") {
        getPrice();
    }
});

closeModalBtn.addEventListener('click', function() {
    modal.classList.add('hide_modal');
});

const vehicles_types = document.querySelectorAll('#vehicles_types li');

for(vehicles_type of vehicles_types) {
    vehicles_type.addEventListener('click', function() {
        // Remove a class .active de todos os elementos
        removeActiveOfAllItems();

        // Limpa o formulário e desabilita os campos
        resetBrand();
        resetModel();
        resetYear();

        // Obtem o valor do data-type
        type = this.dataset.type

        // Atribue ao elemento clicado a class .active
        this.classList.add('active');

        /**
         * Realiza uma requisição AJAX buscando todas as marcas de um 
         * determinado tipo
         */
        getBrands();
    });
}

function removeActiveOfAllItems() {
    for(vehicles_type of vehicles_types) {
        vehicles_type.classList.remove('active');
    }
}

function resetBrand() {
    brand.value = "";
    brand.setAttribute('disabled', 'disabled');
    btn.classList.remove('search_button_show');
}

function resetModel() {
    model.innerHTML = "";
    model.setAttribute('disabled', 'disabled');
    btn.classList.remove('search_button_show');
}

function resetYear() {
    year.innerHTML = "";
    year.setAttribute('disabled', 'disabled');
    btn.classList.remove('search_button_show');
}