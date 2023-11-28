

const getStores = async () => {
    let stores = ``;
    try {
        const response = await axiosClient.get(`/store/`);

        response.data.forEach((store, index) => {
            stores += `
            <div class="col-md-4 col-sm-6 mb-5">
                <div class="card card-store shadow">
                    <div class="card-body text-center pt-5 pb-3">
                        <h5 class="${index % 2 == 0 ? 'text-rosa' : 'text-morado'}"><i class="fas fa-store fa-3x"></i></h5>
                        <h4>${store.name}</h4>
                        <p><i class="fa-solid fa-location-dot"></i> ${store.address}</p>
                        <div class="d-flex justify-content-end">
                            <button type="button" onClick="getStoreId(${store.id})" class="btn btn-morado btn-circle"><i
                                    class="fa-solid fa-eye"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        document.getElementById('stores').innerHTML = stores;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const saveOwner = async (owner) => {
    let ownerRegistered;
    try {
        response = await axiosClient.post(`/person/`, owner);
        ownerRegistered = response.data;
    } catch (error) {
        console.log(error);
    }
    return ownerRegistered;
}

const getById = async () => {
    const storeId = localStorage.getItem('selectedStoreId');
    try {
        const responseDeliver = await axiosClient.get(`/person/`);
        console.log(responseDeliver);
        let selectDelivers = $("#delivers");
        selectDelivers.append(`<option value="0">Señeccione un repartidor</option>`)
        const response = await axiosClient.get(`/store/${storeId}`);

        for (let i = 0; i < responseDeliver.data.length; i++) {
            if (responseDeliver.data[i].id === responseDeliver.data.id) {
                option.selected = true;
            }
            selectDelivers.append(`<option value="${responseDeliver.data[i].id}">${responseDeliver.data[i].name} ${responseDeliver.data[i].lastName}</option>`)
        }

        document.getElementById('nameUpdate').value = response.data.name;
        document.getElementById('addressUpdate').value = response.data.address;
        document.getElementById('rfcUpdate').value = response.data.rfc;
        document.getElementById('ownerNameUpdate').value = response.data.owner.name;
        document.getElementById('phoneUpdate').value = response.data.owner.phone;
        document.getElementById('idOwnerUpdate').value= response.data.owner.id;
        document.getElementById('delivers').value= response.data.deliver.id;

        $('#updateStoreModal').modal('show');
    } catch (error) {
        console.log(error);
    }
}

const updateStore = async () => {
    const storeId = localStorage.getItem('selectedStoreId');
    let owner = {
        "id": document.getElementById('idOwnerUpdate').value,
        "name": document.getElementById('ownerNameUpdate').value,
        "phone": document.getElementById('phoneUpdate').value   
    }
    


    try {
        const responseOwner = await axiosClient.put(`/person/${owner.id}`, owner);

        let store = {
            "id": storeId,
            "name": document.getElementById('nameUpdate').value,
            "address": document.getElementById('addressUpdate').value,
            "rfc": document.getElementById('rfcUpdate').value,
            owner,
            "deliver": {
                "id": document.getElementById('delivers').value,
            }
        }

        const response = await axiosClient.put(`/store/`, store);
        $('#updateStoreModal').modal('hide');
        getStoreById();
        Swal.fire({
            icon: "success",
            title: "Se modificó la tienda",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "No fue posible modificar la tienda",
            showConfirmButton: false,
            timer: 1500
        });
    }
}

const saveStore = async () => {
    let owner = {
        "name": document.getElementById('ownerName').value,
        "phone": document.getElementById('phone').value,
    }

    const ownerRegistered = await saveOwner(owner);

    let store = {
        "name": document.getElementById('name').value,
        "address": document.getElementById('address').value,
        "rfc": document.getElementById('rfc').value,
        "owner": {
            "id" : ownerRegistered.id
        },
        "deliver": {
            "id": document.getElementById('delivers').value,
        }
    }


    console.log(store);
    axiosClient.post(`/store/`, store)
        .then(response => {
            console.log('Respuesta del servidor:', response.data);
            cleanForm();
            getStores();
            $('#saveStoreModal').modal('hide');
            Swal.fire({
                icon: "success",
                title: "Se registró la tienda",
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch(error => {
            console.error('Error en la solicitud POST:', error);
            Swal.fire({
                icon: "error",
                title: "No fue posible registrar la tienda",
                showConfirmButton: false,
                timer: 1500
            });
        });
    
}

const cleanForm = () => {
    document.getElementById('name').value = "";
    document.getElementById('address').value = "";
    document.getElementById('rfc').value = "";
    document.getElementById('ownerName').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('delivers').value= "";
}

const getStoreId = (id) => {
    localStorage.setItem('selectedStoreId', id);
    window.location.href = './store.html'
}

const getDelivers = async () => {
    try {
        const response = await axiosClient.get(`/person/`);
        console.log(response);
        let selectDelivers = $("#delivers");
        selectDelivers.append(`<option value="0">Señeccione un repartidor</option>`)

        for (let i = 0; i < response.data.length; i++) {
            selectDelivers.append(`<option value="${response.data[i].id}">${response.data[i].name} ${response.data[i].lastName}</option>`)
        }

    } catch (error) {
        console.log(error);
    }
}

const getVisits = async (id) => {
    let visits;
    try {
        const response = await axiosClient.get(`/visits/store/${id}`);
        visits = response.data;
    } catch (error) {
        console.log(error);
    }
    return visits;
}

const getStoreById = async () => {
    const storeId = localStorage.getItem('selectedStoreId');
    let store = ``;
    let repartidor = ``;
    let visitCard = ``;
    try {
        const response = await axiosClient.get(`/store/${storeId}`);
        const visits = await getVisits(storeId);
        console.log(visits);
        console.log(response.data);
        store = `
        <div class="card bg-morado card-store-large shadow align-items-center ">
            <div class="card-body ">
                <h1 class="text-white text-center mt-3"><i style="font-size: 150px;" class="fas fa-store fa-3x"></i></h1>
                <h4 class="text-white text-center mb-4">${response.data.name}</h4>
                <div class="d-flex mrl-3 flex-column">
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-location-dot"></i>${response.data.address}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-circle"></i>${response.data.rfc}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-user"></i>${response.data.owner.name + ' ' + response.data.owner.lastName}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-phone"></i>${response.data.owner.phone}</p>
                </div>
            </div>
        </div>
        `
        repartidor = `
            <div class="flex-shrink-0">
                <img
                src="https://media.glamour.mx/photos/643744437c542dd2fac99d96/3:2/w_2559,h_1706,c_limit/lana_del_rey.jpg"
                class="img-redonda">
            </div>
            <div class="flex-grow-1 ms-3">
                <h4 class="d-flex align-items-center justify-content-between">
                <span class="fw-bold">Repartidor asignado</span>
                <i onclick="getById()" style="font-size: 20px;" class="fa-solid fa-pen-to-square"></i>
                </h4>
                <h6 class="fw-lighter" style="font-size: 17px;">${response.data.deliver.name + ' ' + response.data.deliver.lastName}</h6>
            </div>
        `

        visits.forEach((visit, index) => {
            visitCard += `
            <div class="col-md-4 col-6 mb-4 " >
                <div class="card shadow card-visit" data-bs-toggle="modal" style="height:200px;" data-bs-target="#exampleModal">
                    <div class="card-body text-center overflow-auto">
                        <h3 class="circle-visit mx-auto ${index % 2 == 0 ? 'bg-rosa' : 'bg-morado'}"><i class="fa-solid fa-calendar-days"></i></h3>
                        <p>${visit.day_visit}</p>
                        <span class="badge bg-success">${visit.status.desciprtion}</span>
                    </div>
                </div>
            </div>
            `
        });
        console.log(visits.length);

        document.getElementById('store').innerHTML = store;
        document.getElementById('deliver').innerHTML = repartidor;
        document.getElementById('visits').innerHTML = visitCard;
    } catch (error) {
        console.log(error);
    }
}

const hola= () =>{
    console.log('hello world');
}

