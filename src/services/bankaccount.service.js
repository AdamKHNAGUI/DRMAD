import LocalSource from "@/services/localsource.service.js";

function getAccountAmountFromLocalSource(number) {
    return LocalSource.getAccountAmount(number);
}

async function getAccountAmount(number) {
    let response = null;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await getAccountAmountFromLocalSource(number)
    }
        // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch(err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré la solde bancaire'  }
    }
    return response
}

function getAllTransactionsFromLocalSource(number){
    return LocalSource.getAccountTransactions(number);

}

async function getAllTransactions(number) {
    let response = null;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await getAllTransactionsFromLocalSource(number)
    }
        // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch(err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré les transactions'  }
    }
    return response
}


export default{
 getAccountAmount,
    getAllTransactions
}