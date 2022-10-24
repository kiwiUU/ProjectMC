import { default as Redis } from "ioredis"

const redis = new Redis(
    `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`
    );

export default redis;