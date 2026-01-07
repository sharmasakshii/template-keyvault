import { initRedis } from "./setup";

interface SetProp {
  masterKey: {},
  childKey: {},
  expTime: number,
  value: any
}
const isRedisEnabled = process.env.IS_REDIS_ENABLE === 'true';

export const setHKey = async (prop: SetProp): Promise<any> => {
  if (!isRedisEnabled) return null;
  const redis = initRedis()
  let { masterKey = {}, childKey = {}, expTime, value } = prop
  let master = hashKeyFN(masterKey)
  try {

    let subKey = hashKeyFN(childKey)
    if (value === null) return;
    value = JSON.stringify(value)
    await redis.hset(master, subKey, value);
    await redis.expire(master, expTime);
    
  } catch (error) {
    console.log(error, "error")
    throw error
  }
};

// Function to get a value from Redis by key
export const getHKey = async (prop: any): Promise<any> => {
  if (!isRedisEnabled) return null;
  const redis = initRedis()
  const { masterKey = {}, childKey = {} } = prop
  let master = hashKeyFN(masterKey)
  try {
    let subKey = hashKeyFN(childKey)

    let value = await redis.hget(master, subKey);
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch (parseError) {
      console.log("Failed to parse value:", parseError);
      return value;
    }
  } catch (error) {
    console.log(error, "error")
    throw error
  }
};

export const hashKeyFN = (prop: Object) => {
  const keysWithValues = Object.entries(prop)
    .filter(([_key, value]) => value !== "")
    .map(([_key, value]) => value)
    .join('-');
  const keyVal = `${keysWithValues}`

  return keyVal
}

