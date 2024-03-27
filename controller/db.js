const { MongoClient } = require("mongodb");

let client;

async function connectMongoDB() {
    try {
        client = new MongoClient(process.env.MONGODB_URL);
        await client.connect();
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

async function getData(colName, query) {
    let output = [];
    try {
        const db = client.db("Playstation");
        const cursor = db.collection(colName).find(query);
        for await (const data of cursor) {
            output.push(data);
        }
    } catch (err) {
        output.push({ "Error": "Error in getData" });
    }
    return output;
}

async function postData(colName, data) {
    let output;
    try {
        const db = client.db("Playstation");
        output = await db.collection(colName).insertOne(data);
    } catch (err) {
        output = { "response": "Error in postData" };
    }
    return output;
}

async function updateOrder(colName, condition, data) {
    let output;
    try {
        const db = client.db("Playstation");
        output = await db.collection(colName).updateOne(condition, data);
    } catch (err) {
        output = { "response": "Error in update data" };
    }
    return output;
}

async function deleteOrder(colName, condition) {
    let output;
    try {
        const db = client.db("Playstation");
        output = await db.collection(colName).deleteOne(condition);
    } catch (err) {
        output = { "response": "Error in delete data" };
    }
    return output;
}

module.exports = {
    connectMongoDB,
    getData,
    postData,
    updateOrder,
    deleteOrder
};