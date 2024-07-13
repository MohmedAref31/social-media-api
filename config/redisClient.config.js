import redis from "redis";


const redisUrl = 'redis://127.0.0.1:6379';

// const redisClient = redis.createClient(redisUrl);

const client = redis.createClient(redisUrl);

client.on('connect', ()=>{
    console.log("Redis server connected")
})
client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export default client