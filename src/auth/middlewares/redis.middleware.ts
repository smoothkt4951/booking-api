import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { Redis } from 'ioredis'

@Injectable()
export class RedisMiddleware implements NestMiddleware {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next()
      return
    }

    const token = req.headers.authorization.split(' ')[1]

    await this.redisClient.lrange('token', 0, -1, async function (err, result) {
      if (err) {
        /* handle error */
        // throw new HttpException('Token check is error', 501);
        console.log('redis error', err)
        return res.status(500).json({ msg: 'Redis server error!' })
      } else {
        // console.log(result);
        if (result.indexOf(token) > -1) {
          return res.status(400).json({
            status: 400,
            error: 'Invalid Token',
          })
        } else {
          next()
        }
      }
    })
  }
}
