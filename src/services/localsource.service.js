import { items, shopusers, bankaccounts, transactions } from '@/datasource/data.js'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs';


/* Les fonctions ci-dessous doivent mimer ce que renvoie l'API en fonction des requêtes possibles.

  Dans certains cas, ces fonctions vont avoir des paramètres afin de filtrer les données qui se trouvent dans data.js
  Il est fortement conseillé que ces paramètres soient les mêmes que ceux qu'il faudrait envoyer à l'API.

  IMPORTANT : toutes les requêtes à l'API DOIVENT renvoyer un objet JSON au format {error: ..., status: ..., data: ...}
  Cela implique que toutes les foncitons ci-dessous renvoient un objet selon ce format.
 */

/**
 * Si le login et le mot de passe sont fournis, que le login correspond à un utilisateur existant,
 * shopLogin() renvoie un objet contenant uniquement l'id, le nom, le login, l'email
 * et un identifiant de session sous forme d'un uuid. Sinon, un texte d'erreur est renvoyé.
 * NB: pas de test du mot de passe dans cet exemple.
 * @param data
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: {_id: string | *, name: string | *, login: string | *, email: string | *, session}}}
 */
function shopLogin(data) {
    if ((!data.login) || (!data.password))
        return { error: 1, status: 404, data: 'aucun login/pass fourni' };

    const user = shopusers.find(e => e.login === data.login);
    if (!user)
        return { error: 1, status: 404, data: 'login/pass incorrect' };

    const passwordOk = bcrypt.compareSync(data.password, user.password);
    if (!passwordOk)
        return { error: 1, status: 401, data: 'login/pass incorrect' };

    if (!user.session) {
        user.session = uuidv4();
    }

    const u = {
        _id: user._id,
        name: user.name,
        login: user.login,
        email: user.email,
        session: user.session
    };

    return { error: 0, status: 200, data: u };
}

/**
 * getAllViruses() renvoie un tableau d'items dont le format est le même que celui stockée en source locale (donc aussi en BdD côté API)
 * @returns {{error: number, data}}
 */
function getAllViruses() {
  return {error: 0, data: items}
}

/**
 * Si un n° est fourni et qu'il correspond à un compte existant, getAccountAmount() renvoie uniquement le solde
 * du compte, sinon un texte d'erreur.
 * @param number
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: number | *}}
 */
function getAccountAmount(number) {
    if(number && number !== ''){
        let amount = bankaccounts.find(b => b.number === number);
        if (amount){
            return {error: 0, status: 200, data: amount};
        } else {
            return {error:1,status:404,data:"Numéro de compte inexistant"}
        }

    } else {
        return {error: 1, status: 400, data: "Numéro de compte incorrect" };
    }
}

/**
 * Si un n° est fourni et qu'il correspond à un compte existant, getAccountTransactions() renvoie uniquement le solde
 * du compte, sinon un texte d'erreur.
 * @param number
 * @returns {{error: number, status: number, data: ({_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string})[]}|{error: number, status: number, data: string}}
 */
async function getAccountTransactions(number) {
    if(number && number !== '') {
        let account = bankaccounts.find(b => b.number === number);
        if (!account) {
            return { error: 1, status: 404, data: "Compte introuvable" }
        }
        let transaction = transactions.filter(t => t.account === account._id)
        return {error:0,status:200,data:transaction};
    } else {
        return {error:1,status:404,data:"Aucune Solde a été trouvée"};
    }
}

async function getBasket(id) {
    let user = shopusers.find(e => e._id === id);
    if (user.basket == null) user.basket = []
    let basket = JSON.parse(JSON.stringify(user.basket))
    return {error: 0, status: 200, data: basket}
}
async function clearBasket(data) {
    let user = shopusers.find(e => e._id === data._id)
    if (!user) return { error: 1, status: 404, data: 'Utilisateur non trouvé' }

    user.basket = { items: [] }
    return { error: 0, status: 200, data: user.basket }
}
async function addBasket(data) {
    let user = shopusers.find(e => e._id === data._idUser)
    if (!user) return { error: 1, status: 404, data: 'Utilisateur non trouvé' }

    let item = items.find(v => v._id === data._idItem)
    if (!item) return { error: 1, status: 404, data: 'Article introuvable' }



    if (!user.basket) user.basket = []

    const amount = data.amount ?? 1
    if (item.stock < amount) {
        // item.stock -= data.amount
        return { error: 1, status: 400, data: 'Stock insuffisant' }
    }

    const existingItem = user.basket.find(v => v._id === item._id)
    if (existingItem) {
        existingItem.amount += amount
    } else {
        user.basket.push({
            ...item,
            amount
        })
    }

    // Diminue le stock de l’article dans la liste globale
    item.stock -= amount

    // Clone du panier pour éviter les références
    let basket = JSON.parse(JSON.stringify(user.basket))



    return { error: 0, status: 200, data: basket }
}

async function deleteBasket(data) {
    let user = shopusers.find(e => e._id === data._idUser)
    if (!user) return { error: 1, status: 404, data: 'Utilisateur non trouvé' }

    user.basket = user.basket.filter(v => v._id !== data._idItem)

    return { error: 0, status: 200, data: [...user.basket] }
}

export async function orderBasket({ _id, basket }) {
    let user = shopusers.find(e => e._id === _id);
    if (!user) {
        return { error: 1, status: 404, data: 'Utilisateur non trouvé' };
    }

    if (!user.orders) user.orders = [];
    const itemsOrdered = basket.map(b => {
        const virus = items.find(v => v._id === b._id);
        if (!virus) {
            console.warn(`⚠️ Virus introuvable : ${b._id}`);
            return null;
        }
        return {
            item: { ...virus },
            amount: b.amount
        };
    }).filter(Boolean);
    const total = itemsOrdered.reduce((sum, entry) => {
        let price = entry.item.price;

        entry.item.promotion.forEach(promo => {
            if (entry.amount >= promo.amount) {
                price -= price * (promo.discount / 100);
            }
        });

        return sum + price * entry.amount;
    }, 0);

    const newOrder = {
        items: itemsOrdered,
        date: new Date(),
        total,
        status: "waiting_payment",
        uuid: uuidv4()
    };
    user.orders.push(newOrder);


    return { error: 0, status: 200, data: { uuid: newOrder.uuid } };
}

export async function getOrder({ userId, uuid }) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: "Utilisateur introuvable" };

    let order = user.orders.find(o => o.uuid === uuid);
    if (!order) return { error: 1, status: 404, data: "Commande introuvable" };

    let clone = JSON.parse(JSON.stringify(order));
    return { error: 0, status: 200, data: clone };
}

export async function payOrder({ userId, uuid,transactionUuid  }) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: "Utilisateur introuvable" };

    let order = user.orders.find(o => o.uuid === uuid);
    if (!order) return { error: 1, status: 404, data: "Commande introuvable" };

    let transaction = transactions.find(t => t.uuid === transactionUuid);
    if(!transaction) return {error:1,status:404,data:"Transaction introuvable"}

    let TransactionAmount = Math.abs(transaction.amount);

    if (order.total > TransactionAmount){
        return {error:1,status:404,data:`impossible de payer cette commande, il manque ${order.total - transaction.amount} €`}
    }

    order.status = "finalized";

    return { error: 0, status: 200, data: "Commande payée avec succès" };
}

export async function getOrdersByUser(userId) {
    const user = shopusers.find(u => u._id === userId)
    let data = JSON.parse(JSON.stringify(user.orders))
    return {error:0,status:200,data:data}
}

export async function cancelOrder(userId, orderUuid) {
    const user = shopusers.find(u => u._id === userId)
    if (!user) return null

    const order = user.orders.find(o => o.uuid === orderUuid)
    if (order && order.status === 'waiting_payment') {
        order.status = 'cancelled'
    } else {
        console.error(`Impossible d'annuler une commande déjà ${order.status}`)
    }

    return JSON.parse(JSON.stringify(order))
}

export async function getAccount(number) {
    if (!number) {
        return { data: "numéro de compte invalide" }
    }

    const account = bankaccounts.find(acc => acc.number === number)

    if (account) {
        return {error:0,status:200, data: { ...account } }
    } else {
        return { error:1,status:400,data: "numéro de compte invalide" }
    }
}

export async function getTransactions(data) {
    if (!data?.idAccount) {
        return { data: "aucune transaction pour ce compte" }
    }

    // Filtre les transactions correspondant au compte
    const accountTransactions = transactions
        .filter(tx => tx.account === data.idAccount)
        .map(tx => ({ ...tx })) // copie des objets pour éviter modification

    if (accountTransactions.length > 0) {
        return { data: accountTransactions }
    } else {
        return { data: "aucune transaction pour ce compte" }
    }
}

export async function createWithdraw(data) {

    if (!data.idaccount) {
        return { error:1,status:400,data: "id de compte manquant" }
    }

    if(data.amount === 0){
        return { error:1,status:400,data: "transaction non valide" }

    }

    // Cherche le compte
    const account = bankaccounts.find(acc => acc._id === data.idaccount)
    if (!account) {
        return { error:1,status:404,data: "compte invalide" }
    }

    // Crée la transaction
    const newTransaction = {
        _id: uuidv4(), // identifiant unique
        amount: -data.amount, // montant négatif
        account: account._id,
        date: { $date: new Date() },
        uuid: uuidv4()
    }

    // c quoi la diff en l'id et l'uuid

    // Ajoute la transaction au tableau
    transactions.push(newTransaction)

    // Débite le compte
    account.amount -= data.amount
    console.log(transactions)
    // Retourne le résultat
    return { error:0,status:201,data: { uuid: newTransaction.uuid, amount: account.amount } }
}

export async function createPayment(data) {
    if (!data.idaccount) {
        return { error:1,status:400,data: "id de compte invalide" }
    }

    const sender = bankaccounts.find(acc => acc._id === data.idaccount)
    if (!sender) {
        return { error:1,status:404,data: "compte introuvable" }
    }

    const receiver = bankaccounts.find(acc => acc.number === data.destNumber)
    if (!receiver) {
        return { error:1,status:404,data: "compte destinataire inexistant" }
    }

    const withdrawUUID = uuidv4()
    const depositUUID = uuidv4()
    const date = { $date: new Date() }

    const withdrawTx = {
        _id: uuidv4(),
        amount: -Math.abs(data.amount),
        account: sender._id,
        date:date,
        uuid: withdrawUUID,
        destination: receiver._id
    }

    const depositTx = {
        _id: uuidv4(),
        amount: Math.abs(data.amount),
        account: receiver._id,
        date: date,
        uuid: depositUUID
    }

    transactions.push(withdrawTx)
    transactions.push(depositTx)

    sender.amount -= data.amount
    receiver.amount += data.amount

    return { error:0,status:201,data: { uuid: withdrawUUID, amount: sender.amount } }
}


export default{
  shopLogin,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
    getBasket,
    clearBasket,
    deleteBasket,
    addBasket,
    orderBasket,
    getOrder,
    payOrder,
    getOrdersByUser,
    cancelOrder, getAccount , createPayment, createWithdraw, getTransactions

}