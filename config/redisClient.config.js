import redis from "redis";
import dotenv from "dotenv"
dotenv.config()

const redisUrl = process.env.REDIS_URL;

// const redisClient = redis.createClient(redisUrl);

const client = redis.createClient(redisUrl);

client.on('connect', ()=>{
    console.log("Redis server connected")
})
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export default client