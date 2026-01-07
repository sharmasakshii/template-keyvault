import Redis from "ioredis";

const redisService = process.env.REDIS_SERVICE_TIER ?? "Basic";
const host = process.env.REDIS_HOST ?? "127.0.0.1";
const port = Number(process.env.REDIS_PORT) || 6379;
const password = process.env.REDIS_PWD ?? "";

let redis: any = null;


export const initRedis = (): Redis => {
    if (redis) {
        return redis; 
    }

    try {

        if (redisService === "Basic") {
            // Standalone Redis
            redis = new Redis({
                host,
                port,
                password,
                retryStrategy: (times) => Math.min(times * 50, 2000),
            });
        } else {
            // Redis Cluster Mode
            const nodes = [
                { host, port: 7000 },
                { host, port: 7001 },
                { host, port: 7002 },
            ];

            redis = new Redis.Cluster(nodes, {
                redisOptions: {
                    password, // Apply password in cluster mode
                },
            });
        }

        // Handle connection events
        redis.on("connect", () => console.log("Connected to Redis"));
        redis.on("error", (err: any) => console.error("Redis Error:", err));
        redis.on("reconnecting", () => console.log(" Reconnecting to Redis..."));


        setInterval(() => {
            redis.ping().catch(console.error);
        }, 30000);

    } catch (error) {
        console.error("Failed to initialize Redis:", error);
    }

    return redis;
};
