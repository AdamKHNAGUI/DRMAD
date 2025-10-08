import LocalSource from "@/services/localsource.service.js";

async function shopLoginFromLocalSource(data) {
    // récupération auprès de la source locale
    return LocalSource.shopLogin(data)
}

/*
async function shopLoginFromAPI(data) {
  // a écrire quand l'API est fonctionnelle
  return {}
}
 */

async function getAllVirusesFromLocalSource() {
    // récupération auprès de la source locale
    return LocalSource.getAllViruses()
}

/*
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/

async function shopLogin(data) {
    let response = null;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await shopLoginFromLocalSource(data)
    }
        // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'}
    }
    return response
}


async function getAllViruses() {
    let response = null;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await getAllVirusesFromLocalSource()
    }
        // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la liste des viruses'}
    }
    return response
}

async function getBasketFromLocalSource(bskt){
    return LocalSource.getBasket(bskt);
}

async function getBasket(bskt){
    let response = null;
    try {
        response = await getBasketFromLocalSource(bskt);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer le panier'}
    }
    return response;
}

async function addBasketFromLocalSource(bskt){
    return LocalSource.addBasket(bskt);
}

async function addBasket(bskt){
    let response = null;
    try {
        response = await addBasketFromLocalSource(bskt);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer le panier'}
    }
    return response;
}

async function deleteBasketFromLocalSource(data){
    return LocalSource.deleteBasket(data);
}

async function deleteBasket(data){
    let response = null;
    try {
        response = await deleteBasketFromLocalSource(data);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer le panier'}
    }
    return response;
}

async function clearBasketFromLocalSource(){
    return LocalSource.clearBasket();
}

async function clearBasket(){
    let response = null;
    try {
        response = await clearBasketFromLocalSource();
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de récupérer le panier'}
    }
    return response;
}


async function orderBasketFromLocalSource(order){
    return LocalSource.orderBasket(order);
}

async function orderBasket(order){
    console.log(order)
    let response = null;
    try {
        response = await orderBasketFromLocalSource(order);
    } catch (err){
        response = {error:1, status:404,data:'erreur réseau, impossible de créé la commande'}
    }
    return response;
}
async function getOrderFromLocalSource(order){
    return LocalSource.getOrder(order);
}

async function getOrder(order){
    let response = null;
    try {
        response = await getOrderFromLocalSource(order);

    } catch(err){
        response = {error:1,status:404,data:'erreur réseau, impossbile de récupérer la commande'}
    }
    return response;
}

async function payOrderFromLocalSource(order){
    return LocalSource.payOrder(order);
}

async function payOrder(order){
    console.log(order)
    let response = null;
    try {
        response = await payOrderFromLocalSource(order);

    } catch(err){
        response = {error:1,status:404,data:'erreur réseau, impossbile de récupérer la commande'}
    }
    return response;
}


async function getOrdersByUserFromLocalSource(id){
    return LocalSource.getOrdersByUser(id);
}

async function getOrdersByUser(id){
    let response = null;
    try {
        response = await getOrdersByUserFromLocalSource(id);

    } catch(err){
        response = {error:1,status:404,data:'erreur réseau, impossbile de récupérer les commandes'}
    }
    return response;
}

async function cancelOrderFromLocalSource(id){
    return LocalSource.cancelOrder(id);
}

async function cancelOrder(id){
    let response = null;
    try {
        response = await cancelOrderFromLocalSource(id);

    } catch(err){
        response = {error:1,status:404,data:'erreur réseau, impossbile d\'annuler la commande'}
    }
    return response;
}


export default {
    shopLogin,
    getAllViruses,
    getBasket,
    deleteBasket,
    clearBasket,
    addBasket,
    orderBasket,
    getOrder,
    payOrder,
    getOrdersByUser,
    cancelOrder
}