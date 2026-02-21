import { Request, Response, NextFunction } from 'express'
import { SorobanService } from '../services/sorobanService'

const sorobanService = new SorobanService()

export class GroupsController {
  async listGroups(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Implement group listing from Soroban
      const groups = await sorobanService.getAllGroups()
      res.json({ success: true, data: groups })
    } catch (error) {
      next(error)
    }
  }

  async getGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const group = await sorobanService.getGroup(id)
      
      if (!group) {
        return res.status(404).json({ 
          success: false, 
          error: 'Group not found' 
        })
      }
      
      res.json({ success: true, data: group })
    } catch (error) {
      next(error)
    }
  }

  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupData = req.body
      // TODO: Validate with Zod schema
      const result = await sorobanService.createGroup(groupData)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { publicKey } = req.body
      const result = await sorobanService.joinGroup(id, publicKey)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async contribute(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { amount, publicKey } = req.body
      const result = await sorobanService.contribute(id, publicKey, amount)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const members = await sorobanService.getGroupMembers(id)
      res.json({ success: true, data: members })
    } catch (error) {
      next(error)
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const transactions = await sorobanService.getGroupTransactions(id)
      res.json({ success: true, data: transactions })
    } catch (error) {
      next(error)
    }
  }
}
